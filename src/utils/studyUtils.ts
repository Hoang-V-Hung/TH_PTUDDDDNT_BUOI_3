import type {
  Assignment,
  StudyResult,
  StudySession,
  StudentChanges,
} from '../types/study';
import { courses } from '../data/studyData';

export const findCourse = (id: string) =>
  courses.find(course => course.id === id);
export const normalizeSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
export const formatDeadline = (value: string) =>
  `${formatDate(value)} · ${new Date(value).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
export const dayNames = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
];
export const dayCodes = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}
export function weekDates(offset = 0, now = new Date()): Date[] {
  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}
export function sessionsForDate(sessions: StudySession[], date: Date) {
  const key = dateKey(date);
  return sessions
    .filter(
      session =>
        session.dayOfWeek === date.getDay() &&
        key >= session.startDate &&
        key <= session.endDate,
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}
export type AssignmentStatus = 'completed' | 'overdue' | 'today' | 'pending';
export function assignmentStatus(
  assignment: Assignment,
  now = new Date(),
): AssignmentStatus {
  if (assignment.completed) {
    return 'completed';
  }
  if (new Date(assignment.dueDate).getTime() < now.getTime()) {
    return 'overdue';
  }
  return dateKey(new Date(assignment.dueDate)) === dateKey(now)
    ? 'today'
    : 'pending';
}
export const gradeAverage = (result: StudyResult) =>
  Math.round(
    result.components.reduce(
      (sum, part) => sum + (part.score * part.weight) / 100,
      0,
    ) * 100,
  ) / 100;
// Quy đổi mẫu; thay theo quy chế của trường khi dùng dữ liệu chính thức.
export function gradeScale(score: number) {
  if (score >= 8.5) {
    return { letter: 'A', point: 4, label: 'Giỏi' };
  }
  if (score >= 7) {
    return { letter: 'B', point: 3, label: 'Khá' };
  }
  if (score >= 5.5) {
    return { letter: 'C', point: 2, label: 'Trung bình' };
  }
  if (score >= 4) {
    return { letter: 'D', point: 1, label: 'Đạt' };
  }
  return { letter: 'F', point: 0, label: 'Chưa đạt' };
}
export function semesterSummary(results: StudyResult[]) {
  let credits = 0;
  let weighted = 0;
  let passedCredits = 0;
  for (const result of results) {
    const course = findCourse(result.courseId);
    if (!course) {
      continue;
    }
    const grade = gradeScale(gradeAverage(result));
    credits += course.credits;
    weighted += grade.point * course.credits;
    if (grade.point > 0) {
      passedCredits += course.credits;
    }
  }
  return { credits, passedCredits, gpa: credits ? weighted / credits : 0 };
}
export function validateStudent(
  changes: StudentChanges,
): Partial<Record<keyof StudentChanges, string>> {
  const errors: Partial<Record<keyof StudentChanges, string>> = {};
  if (
    changes.fullName.trim().length < 2 ||
    changes.fullName.trim().length > 80
  ) {
    errors.fullName = 'Họ tên cần từ 2 đến 80 ký tự.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changes.email.trim())) {
    errors.email = 'Nhập địa chỉ email hợp lệ.';
  }
  if (!/^(?:\+84|0)\d{9}$/.test(changes.phone.replace(/[\s.-]/g, ''))) {
    errors.phone =
      'Nhập số điện thoại Việt Nam gồm 10 số hoặc bắt đầu bằng +84.';
  }
  return errors;
}
