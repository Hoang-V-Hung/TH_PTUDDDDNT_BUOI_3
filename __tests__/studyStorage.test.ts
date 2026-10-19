import AsyncStorage from '@react-native-async-storage/async-storage';
import { createInitialStudyState } from '../src/data/studyData';
import * as studyData from '../src/data/studyData';
import {
  loadStudyState,
  saveStudyState,
  restoreStudyDefaults,
  STUDY_BACKUP_KEY,
  STUDY_STORAGE_KEY,
} from '../src/services/studyStorage';

beforeEach(async () => {
  jest.restoreAllMocks();
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('lưu và khôi phục hồ sơ, trạng thái cùng hạn bài tập', async () => {
  expect(await loadStudyState()).toBeNull();
  const state = createInitialStudyState(new Date(2026, 9, 19));
  state.student.fullName = 'Trần Hoài An';
  state.assignments[0].completed = true;
  await saveStudyState(state);
  expect(await loadStudyState()).toEqual(state);
});

test('đổi mã môn và nội dung bài tập cũ, giữ nguyên hồ sơ, hạn nộp và trạng thái đã lưu', async () => {
  const expected = createInitialStudyState(new Date(2026, 9, 19));
  expected.student.fullName = 'Trần Hoài An';
  expected.assignments[0].completed = true;
  const oldCourseIds = [
    'INT3120',
    'INT2207',
    'INT2210',
    'INT3306',
    'INT2209',
    'ENG2003',
    'INT3120',
  ];
  const saved = {
    ...expected,
    assignments: expected.assignments.map((assignment, index) => ({
      ...assignment,
      courseId: oldCourseIds[index],
      title: 'Tên bài tập từ danh sách môn cũ',
      description: 'Nội dung bài tập cũ.',
    })),
  };
  await AsyncStorage.setItem(
    STUDY_STORAGE_KEY,
    JSON.stringify({ version: 1, state: saved }),
  );
  const loaded = await loadStudyState();
  expect(loaded).toEqual(expected);
  await saveStudyState(loaded!);
  expect(await loadStudyState()).toEqual(expected);
});

test('hồ sơ mẫu v1 cũ được thay bằng studyData mới và giữ tiến độ, hạn nộp', async () => {
  const expected = createInitialStudyState(new Date(2026, 9, 19));
  expected.assignments[4].completed = true;
  const oldState = {
    student: {
      id: '23020345',
      fullName: 'Nguyễn Minh Anh',
      className: 'CNTT-K68',
      major: 'Công nghệ thông tin',
      email: 'minhanh.23020345@sv.edu.vn',
      phone: '0912345678',
    },
    assignments: expected.assignments.map(item => ({
      ...item,
      courseId: 'MON-CU',
    })),
  };
  await AsyncStorage.setItem(
    STUDY_STORAGE_KEY,
    JSON.stringify({ version: 1, state: oldState }),
  );
  expect(await loadStudyState()).toEqual(expected);
});

test('sửa hồ sơ trong studyData cập nhật các trường mẫu nhưng giữ trường đã sửa trong app', async () => {
  const before = createInitialStudyState(new Date(2026, 9, 19));
  const saved = {
    ...before,
    student: { ...before.student, fullName: 'Tên đã sửa trong ứng dụng' },
  };
  await saveStudyState(saved);
  const after = {
    ...before,
    student: {
      ...before.student,
      fullName: 'Tên mẫu mới',
      email: 'moi@example.com',
      phone: '0987654321',
      className: 'Lớp mới',
    },
  };
  jest.spyOn(studyData, 'createInitialStudyState').mockReturnValue(after);
  const loaded = await loadStudyState();
  expect(loaded?.student).toEqual({
    ...after.student,
    fullName: saved.student.fullName,
  });
  expect(loaded?.assignments).toEqual(before.assignments);
  await saveStudyState(loaded!);
  expect(await loadStudyState()).toEqual(loaded);
});

test('tất cả trường hồ sơ chưa sửa cập nhật khi studyData thay đổi', async () => {
  const before = createInitialStudyState(new Date(2026, 9, 19));
  await saveStudyState(before);
  const after = {
    ...before,
    student: {
      ...before.student,
      fullName: 'Sinh viên mẫu mới',
      email: 'sinhvien@example.com',
      phone: '0987654321',
      className: 'Lớp mới',
      major: 'Ngành mới',
    },
  };
  jest.spyOn(studyData, 'createInitialStudyState').mockReturnValue(after);
  expect((await loadStudyState())?.student).toEqual(after.student);
});

test('bài tập cập nhật nội dung từ studyData, bổ sung bài mới và giữ tiến độ bài cũ', async () => {
  const before = createInitialStudyState(new Date(2026, 9, 19));
  before.assignments[0].completed = true;
  await saveStudyState(before);
  const newAssignment = { ...before.assignments[1], id: 'assignment-new' };
  const after = {
    ...before,
    assignments: [
      {
        ...before.assignments[0],
        title: 'Nội dung mới',
        dueDate: new Date(2026, 11, 1).toISOString(),
        completed: false,
      },
      newAssignment,
    ],
  };
  jest.spyOn(studyData, 'createInitialStudyState').mockReturnValue(after);
  expect((await loadStudyState())?.assignments).toEqual([
    {
      ...after.assignments[0],
      completed: true,
      dueDate: before.assignments[0].dueDate,
    },
    newAssignment,
  ]);
});

test('khôi phục mẫu sao lưu dữ liệu lỗi trước khi thay thế', async () => {
  await AsyncStorage.setItem(STUDY_STORAGE_KEY, '{');
  const restored = await restoreStudyDefaults();
  expect(await AsyncStorage.getItem(STUDY_BACKUP_KEY)).toBe('{');
  expect(await loadStudyState()).toEqual(restored);
  expect(restored.student).toEqual(createInitialStudyState().student);
});

test('khôi phục mẫu thất bại không ghi đè khi chưa sao lưu được dữ liệu cũ', async () => {
  await AsyncStorage.setItem(STUDY_STORAGE_KEY, '{');
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('Bộ nhớ đầy'));
  await expect(restoreStudyDefaults()).rejects.toThrow();
  expect(await AsyncStorage.getItem(STUDY_STORAGE_KEY)).toBe('{');
});

test.each([
  '{',
  JSON.stringify({ version: 99, state: {} }),
  JSON.stringify({ version: 1, state: { student: {}, assignments: [] } }),
])('phát hiện cache lỗi và giữ nguyên bản đã lưu', async raw => {
  await AsyncStorage.setItem(STUDY_STORAGE_KEY, raw);
  await expect(loadStudyState()).rejects.toThrow();
  expect(await AsyncStorage.getItem(STUDY_STORAGE_KEY)).toBe(raw);
});

test('từ chối bài tập có ngày không hợp lệ hoặc mã trùng', async () => {
  const state = createInitialStudyState();
  state.assignments[0].dueDate = 'ngày sai';
  await saveStudyState(state);
  await expect(loadStudyState()).rejects.toThrow();
  state.assignments[0].dueDate = new Date().toISOString();
  state.assignments.push(state.assignments[0]);
  await saveStudyState(state);
  await expect(loadStudyState()).rejects.toThrow();
});
