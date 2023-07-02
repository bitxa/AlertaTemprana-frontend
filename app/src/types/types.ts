export interface Course {
  id?:  string;
  value: string;
  text: string;
}

export interface Task {
  id?:  string ;
  course: string ;
  title: string ;
  publicationDate:  Date;
  deadline: Date;
  description: string ;
  details: string ;
}