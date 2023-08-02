const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBxPlVeXmCYwP-g029uHrUC0aBEF8oPe18",
  authDomain: "alertatemprana-utpl.firebaseapp.com",
  projectId: "alertatemprana-utpl",
  storageBucket: "alertatemprana-utpl.appspot.com",
  messagingSenderId: "976747645210",
  appId: "1:976747645210:web:921139ff2b1e96aef904a3",
  measurementId: "G-5X73R0BDYY",
};

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Get the Firebase Authentication instance
const auth = getAuth(app);

// Get the Firestore instance
const db = getFirestore(app);

// Create a student user
const createStudentUser = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Customize the user attributes for a student
    const student = {
      id: user.uid,
      initials: "JS",
      username: "jsmith",
      password: "1",
      fullName: "Jane Smith",
      email: user.email,
      role: "estudiante",
      tasks: [],
      section: "2",
    };

    // Save the student data to Firebase Firestore
    await setDoc(doc(db, "students", student.id), student);

    console.log("Student user created and data saved successfully.");
  } catch (error) {
    console.error("Error creating student user:", error);
  }
};

// Create a teacher user
const createTeacherUser = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Customize the user attributes for a teacher
    const teacher = {
      id: user.uid,
      initials: "JP",
      username: "jperez",
      password: "1",
      fullName: "Juan Perez",
      email: user.email,
      role: "profesor",
      sections: ["1", "2"],
    };

    // Save the teacher data to Firebase Firestore
    await setDoc(doc(db, "teachers", teacher.id), teacher);

    console.log("Teacher user created and data saved successfully.");
  } catch (error) {
    console.error("Error creating teacher user:", error);
  }
};

// Usage example
//createStudentUser("student@example.com", "password123");
//createTeacherUser("teacher@example.com", "password123");

const createSections = async () => {
  try {
    const sections = [
      {
        id: "1",
        name: "Section 1",
        professor: "lbehJrAMZpYzbAX1zGeH6KKvwjw1",
        tasks: [],
        students: ["KZderas7s0UXQkf3qBwJW5wEgzN2"],
      },
    ];

    for (let section of sections) {
      await setDoc(doc(db, "sections", section.id), section);
    }

    console.log("Sections created and data saved successfully.");
  } catch (error) {
    console.error("Error creating sections:", error);
  }
};

createSections();
