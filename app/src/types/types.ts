export interface User {
  id: string;
  initials: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: string;
}

export interface Professor extends User {
  id: string;
}

export interface Student extends User {
  id: string;
  section: string;
  tasks: StudentTaskAttempt[];
}

export interface Task {
  id: string;
  section: string;
  professor: string;
  student: string;
  title: string;
  publicationDate: Date;
  deadline: Date;
  description: string;
  details: string;
  file: File | null;
  fileUrl?: string;
}

export interface StudentTask {
  student: string;
  task: string;
  taskStatus: string;
}

export interface StudentTaskAttempt {
  task: string;
  uploadedFile?: File;
  lastModificationDate: Date;
  attemptStatus: string;
}

export interface Section {
  id: string;
  name: string;
  professor: string;
}
