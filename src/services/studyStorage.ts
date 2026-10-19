import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Assignment,
  Student,
  StudentChanges,
  StudyState,
} from '../types/study';
import { createInitialStudyState } from '../data/studyData';
import { validateStudent } from '../utils/studyUtils';

export const STUDY_STORAGE_KEY = '@tkgdnd/study/v1';
export const STUDY_BACKUP_KEY = `${STUDY_STORAGE_KEY}/backup`;

// Bản v1 chưa lưu thông tin mẫu gốc để phân biệt với các chỉnh sửa trong app.
const legacySeedStudent: Student = {
  id: '23020345',
  fullName: 'Nguyễn Minh Anh',
  className: 'CNTT-K68',
  major: 'Công nghệ thông tin',
  email: 'minhanh.23020345@sv.edu.vn',
  phone: '0912345678',
};
const studentKeys: (keyof Student)[] = [
  'id',
  'fullName',
  'className',
  'major',
  'email',
  'phone',
];
const editableStudentKeys: (keyof StudentChanges)[] = [
  'fullName',
  'email',
  'phone',
];

export class StudyStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StudyStorageError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStudent(value: unknown): value is Student {
  return (
    isRecord(value) && studentKeys.every(key => typeof value[key] === 'string')
  );
}

export async function loadStudyState(): Promise<StudyState | null> {
  const raw = await AsyncStorage.getItem(STUDY_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new StudyStorageError('Dữ liệu đã lưu không đúng định dạng.');
  }
  if (
    !isRecord(parsed) ||
    (parsed.version !== 1 && parsed.version !== 2) ||
    !isRecord(parsed.state)
  ) {
    throw new StudyStorageError('Phiên bản dữ liệu đã lưu không được hỗ trợ.');
  }
  const state = parsed.state;
  const student = state.student;
  if (
    !isStudent(student) ||
    Object.keys(validateStudent(student)).length > 0 ||
    !Array.isArray(state.assignments)
  ) {
    throw new StudyStorageError(
      'Hồ sơ hoặc danh sách bài tập đã lưu không hợp lệ.',
    );
  }
  const seedStudent =
    parsed.version === 1 ? legacySeedStudent : parsed.seedStudent;
  if (!isStudent(seedStudent)) {
    throw new StudyStorageError(
      'Dữ liệu đã lưu thiếu thông tin hồ sơ mẫu gốc.',
    );
  }

  const defaults = createInitialStudyState();
  const mergedStudent = { ...defaults.student };
  // Trường chưa sửa trong app đi theo studyData; trường đã chỉnh sửa được giữ lại.
  if (student.id === defaults.student.id) {
    for (const key of editableStudentKeys) {
      if (student[key] !== seedStudent[key]) {
        mergedStudent[key] = student[key];
      }
    }
  }

  const ids = new Set<string>();
  const savedAssignments = new Map<
    string,
    Pick<Assignment, 'completed' | 'dueDate'>
  >();
  for (const item of state.assignments) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      ids.has(item.id) ||
      typeof item.courseId !== 'string' ||
      typeof item.title !== 'string' ||
      typeof item.description !== 'string' ||
      typeof item.completed !== 'boolean' ||
      typeof item.dueDate !== 'string' ||
      !Number.isFinite(Date.parse(item.dueDate))
    ) {
      throw new StudyStorageError(
        'Danh sách bài tập đã lưu có mục trùng hoặc không hợp lệ.',
      );
    }
    ids.add(item.id);
    savedAssignments.set(item.id, {
      completed: item.completed,
      dueDate: item.dueDate,
    });
  }
  // ID bài tập ổn định qua các lần đổi mã môn; nội dung luôn lấy từ studyData.
  const assignments = defaults.assignments.map(template => {
    const saved = savedAssignments.get(template.id);
    return saved
      ? { ...template, completed: saved.completed, dueDate: saved.dueDate }
      : template;
  });
  return { student: mergedStudent, assignments };
}
export async function saveStudyState(state: StudyState): Promise<void> {
  await AsyncStorage.setItem(
    STUDY_STORAGE_KEY,
    JSON.stringify({
      version: 2,
      seedStudent: createInitialStudyState().student,
      state,
    }),
  );
}

export async function restoreStudyDefaults(): Promise<StudyState> {
  const previous = await AsyncStorage.getItem(STUDY_STORAGE_KEY);
  if (previous !== null) {
    await AsyncStorage.setItem(STUDY_BACKUP_KEY, previous);
  }
  const defaults = createInitialStudyState();
  await saveStudyState(defaults);
  return defaults;
}
