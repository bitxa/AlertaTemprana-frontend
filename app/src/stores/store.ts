import { defineStore } from "pinia";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import JSZipUtils from "jszip-utils";

import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytes,
  updateMetadata,
  listAll,
  getBlob,
getMetadata,
} from "firebase/storage";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { firebaseApp } from "@/main";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import type {
  Task,
  Student,
  Professor,
  Section,
  User,
  StudentTaskAttempt,
  StudentTask,
} from "@/types/types";
import JSZip from "jszip";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const useStore = defineStore({
  id: "main",
  state: () => ({
    users: [] as User[],
    sections: [] as Section[],
    tasks: [] as Task[],
    studentTasks: [] as StudentTask[],
  }),
  getters: {
    getCurrentUser(): User | null {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        const user = JSON.parse(userCookie) as User;
        return user;
      }
      return null;
    },
  },
  actions: {
    async fetchUsers() {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      this.users = querySnapshot.docs.map((doc) => doc.data() as User);
    },

    async fetchSections() {
      const q = query(collection(db, "sections"));
      const querySnapshot = await getDocs(q);
      this.sections = querySnapshot.docs.map((doc) => doc.data() as Section);
    },

    async fetchTasks(professorId: string) {
      const q = query(
        collection(db, "tasks"),
        where("professor", "==", professorId)
      );
      const querySnapshot = await getDocs(q);
      this.tasks = querySnapshot.docs.map((doc) => doc.data() as Task);
    },

    async fetchStudentTasks(
      studentId: string,
      status: string
    ): Promise<Task[]> {
      try {
        const q = query(
          collection(db, "studentTasks"),
          where("student", "==", studentId),
          where("taskStatus", "==", status) 
        );

        const querySnapshot = await getDocs(q);
        const studentTasks = querySnapshot.docs.map(
          (doc) => doc.data() as StudentTask
        );

        // Now, let's get the corresponding Task documents using the task IDs
        const taskIds = studentTasks.map((studentTask) => studentTask.task);
        const taskPromises = taskIds.map((taskId) =>
          getDoc(doc(db, "tasks", taskId))  
        );
        const taskSnapshots = await Promise.all(taskPromises);
        const tasks = taskSnapshots.map((snapshot) => snapshot.data() as Task);
     
        return tasks;
      } catch (error) {
        console.error("Error fetching student tasks: ", error);
        return [];
      }
    },

    async login(email: string, password: string): Promise<User | null> {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (userCredential.user) {
          const userId = userCredential.user.uid;
          const studentQuery = query(
            collection(db, "students"),
            where("id", "==", userId)
          );
          const teacherQuery = query(
            collection(db, "teachers"),
            where("id", "==", userId)
          );

          const [studentSnapshot, teacherSnapshot] = await Promise.all([
            getDocs(studentQuery),
            getDocs(teacherQuery),
          ]);

          if (!studentSnapshot.empty) {
            const student = studentSnapshot.docs[0].data() as Student;
            Cookies.set("user", JSON.stringify(student));
            return Promise.resolve(student);
          }

          if (!teacherSnapshot.empty) {
            const teacher = teacherSnapshot.docs[0].data() as Professor;
            Cookies.set("user", JSON.stringify(teacher));
            return Promise.resolve(teacher);
          }
        }
      } catch (error) {
        console.error("Error in login: ", error);
      }

      return null;
    },

    async logout() {
      Cookies.remove("user");
    },

    async uploadFileAndGetURL(
      file: File,
      taskId: string
    ): Promise<string | null> {
      try {
        // Generate a unique file name using UUID
        const fileName = file.name;
        console.log("File name:", fileName);

        // Get the Storage instance
        const storage = getStorage(firebaseApp);

        // Create a reference to the storage location with the filename
        const storageRef = ref(storage, `taskFiles/${taskId}/${file.name}`);

        // Upload the file to Firebase Storage with the correct content type
        const contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        const metadata = { contentType };
        await uploadBytes(storageRef, file, metadata);

        // Get the download URL of the uploaded file
        const snapshot = await getDownloadURL(storageRef);
        const downloadUrl = snapshot as string;
        console.log("Download URL:", downloadUrl);

        return downloadUrl;
      } catch (error) {
        console.error("Error uploading file to Firebase Storage: ", error);
        return null;
      }
    },

    async createTask(task: Task): Promise<Task | null> {
      try {
        task.file = null;

        const taskDocRef = await addDoc(collection(db, "tasks"), task);
        const newTask = { ...task };
        console.log("New Task:", newTask);

        const students = await this.fetchStudents();
        for (const student of students) {
          const studentTask: StudentTask = {
            student: student.id,
            task: taskDocRef.id,
            taskStatus: "pending",
          };
          await addDoc(collection(db, "studentTasks"), studentTask);
        }

        this.tasks.push(newTask);

        return newTask;
      } catch (error) {
        console.error("Error creating task: ", error);
        return null;
      }
    },

    async updateTask(task: Task): Promise<boolean> {
      console.log("Received task for update: ", task);

      const taskIndex = this.tasks.findIndex((t) => t.id === task.id);
      if (taskIndex === -1) {
        console.error("Task not found in local state: ", task.id);
        return false;
      }

      try {
        const { id, ...updatedTask } = task;
        console.log(`Updating task: ${id}`); // Log here
        console.log(`With data: `, updatedTask); // Log here
        await updateDoc(doc(db, "tasks", task.id), updatedTask);
        console.log(`Update successful for task: ${id}`); // Log here
        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
        return true;
      } catch (error) {
        console.error("Error updating task: ", error);
        return false;
      }
    },

    async deleteTask(taskId: string): Promise<boolean> {
      try {
        await deleteDoc(doc(db, "tasks", taskId));
        await this.fetchTasks(this.getCurrentUser?.id as string);
        return true;
      } catch (error) {
        console.error("Error deleting task: ", error);
        return false;
      }
    },

    async createTaskAttempt(
      taskId: string,
      studentId: string
    ): Promise<StudentTaskAttempt | null> {
      try {
        const taskDocRef = doc(db, "tasks", taskId);
        const taskDocSnapshot = await getDoc(taskDocRef);

        if (taskDocSnapshot.exists()) {
          const taskData = taskDocSnapshot.data() as Task;
          const studentDocRef = doc(db, "students", studentId);
          const studentDocSnapshot = await getDoc(studentDocRef);

          if (studentDocSnapshot.exists()) {
            const studentData = studentDocSnapshot.data() as Student;
            const taskAttempt: StudentTaskAttempt = {
              task: taskId,
              uploadedFile: undefined,
              lastModificationDate: new Date(),
              attemptStatus: "Not Started",
            };

            studentData.tasks.push(taskAttempt);

            await updateDoc(studentDocRef, {
              tasks: studentData.tasks,
            });

            return taskAttempt;
          }
        }
      } catch (error) {
        console.error("Error creating task attempt: ", error);
      }

      return null;
    },

    async updateTaskAttempt(
      studentId: string,
      taskAttempt: StudentTaskAttempt
    ): Promise<boolean> {
      try {
        const studentDocRef = doc(db, "students", studentId);
        const studentDocSnapshot = await getDoc(studentDocRef);

        if (studentDocSnapshot.exists()) {
          const studentData = studentDocSnapshot.data() as Student;

          const taskIndex = studentData.tasks.findIndex(
            (attempt) => attempt.task === taskAttempt.task
          );

          if (taskIndex !== -1) {
            studentData.tasks.splice(taskIndex, 1, taskAttempt);

            await updateDoc(studentDocRef, {
              tasks: studentData.tasks,
            });

            return true;
          }
        }
      } catch (error) {
        console.error("Error updating task attempt: ", error);
      }

      return false;
    },

    async deleteTaskAttempt(
      studentId: string,
      taskId: string
    ): Promise<boolean> {
      try {
        const studentDocRef = doc(db, "students", studentId);
        const studentDocSnapshot = await getDoc(studentDocRef);

        if (studentDocSnapshot.exists()) {
          const studentData = studentDocSnapshot.data() as Student;

          const taskIndex = studentData.tasks.findIndex(
            (attempt) => attempt.task === taskId
          );

          if (taskIndex !== -1) {
            studentData.tasks.splice(taskIndex, 1);

            await updateDoc(studentDocRef, {
              tasks: studentData.tasks,
            });

            return true;
          }
        }
      } catch (error) {
        console.error("Error deleting task attempt: ", error);
      }

      return false;
    },

    async fetchStudents(): Promise<Student[]> {
      try {
        const q = query(collection(db, "students"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => doc.data() as Student);
      } catch (error) {
        console.error("Error fetching students: ", error);
        return [];
      }
    },
    async fetchTaskById(taskId: string): Promise<Task | null> {
      try {
        const q = query(collection(db, "tasks"), where("id", "==", taskId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const taskData = querySnapshot.docs[0].data() as Task;
          return taskData;
        }

        return null;
      } catch (error) {
        console.error("Error fetching task by ID: ", error);
        return null;
      }
    },

    async  fetchFileFromStorage(taskId: string): Promise<[ArrayBuffer | null, string]> {
      try {
        const storage = getStorage(firebaseApp);
        const taskFilesRef = ref(storage, `taskFiles/${taskId}`);
        const items = await listAll(taskFilesRef);
        const fileRef = items.items[0];
    
        if (!fileRef) {
          throw new Error("No documents found in the taskFiles folder");
        }
    
        const fileMetadata = await getMetadata(fileRef);  // fetch metadata here
        const fileBlob = await getBlob(fileRef);
        const fileReader = new FileReader();
    
        return new Promise<[ArrayBuffer | null, string]>((resolve, reject) => {
          fileReader.onloadend = () => {
            if (fileReader.result instanceof ArrayBuffer) {
              resolve([fileReader.result, fileMetadata.name || ""]);  // return the array buffer and file name
            } else {
              reject(new Error("Failed to convert file data to ArrayBuffer"));
            }
          };
    
          fileReader.onerror = () => {
            reject(new Error("Error reading file data"));
          };
    
          fileReader.readAsArrayBuffer(fileBlob);
        });
      } catch (error) {
        console.error("Error fetching file from Firebase Storage: ", error);
        return [null, ""];
      }
    },

    async unzipArrayBuffer(arrayBuffer: ArrayBuffer) {
      try {
        const zip = new JSZip();
        const unzipped = await zip.loadAsync(arrayBuffer);
        unzipped.forEach((relativePath, file) => {
          console.log("File in zip:", relativePath);
        });

        // you can add your own logic to handle the unzipped data here

        return unzipped;
      } catch (error) {
        console.error("Error unzipping ArrayBuffer: ", error);
        return null;
      }
    },
  },
});
