export interface Student {
  id: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
}
export interface Course {
  id: string;
  name: string;
  credits: number;
  lecturer: string;
  semester: string;
  status: 'active' | 'completed';
  description: string;
}
export interface StudySession {
  id: string;
  courseId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  type: 'Lý thuyết' | 'Thực hành';
  startDate: string;
  endDate: string;
  note: string;
}
export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description: string;
}
export interface GradeComponent {
  name: string;
  weight: number;
  score: number;
}
export interface StudyResult {
  id: string;
  courseId: string;
  components: GradeComponent[];
}
export interface StudyState {
  student: Student;
  assignments: Assignment[];
}
export type StudentChanges = Pick<Student, 'fullName' | 'email' | 'phone'>;
