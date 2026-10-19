import {
  courses,
  createInitialStudyState,
  studyResults,
  studySessions,
} from '../src/data/studyData';
import type { Course, StudyResult } from '../src/types/study';
import {
  assignmentStatus,
  dateKey,
  gradeAverage,
  gradeScale,
  normalizeSearch,
  semesterSummary,
  sessionsForDate,
  validateStudent,
  weekDates,
} from '../src/utils/studyUtils';

const now = new Date(2026, 9, 19, 10, 0);

test('dữ liệu môn, lịch, bài tập và kết quả tham chiếu nhất quán', () => {
  const ids = new Set(courses.map(course => course.id));
  for (const item of [
    ...studySessions,
    ...studyResults,
    ...createInitialStudyState(now).assignments,
  ]) {
    expect(ids.has(item.courseId)).toBe(true);
  }
  expect(ids.size).toBe(courses.length);
  for (const course of courses) {
    expect(Number.isInteger(course.credits) && course.credits > 0).toBe(true);
  }
});

test('tìm kiếm hỗ trợ tiếng Việt có dấu, không dấu và chữ đ', () => {
  expect(normalizeSearch('  CƠ SỞ DỮ LIỆU  ')).toBe('co so du lieu');
  expect(normalizeSearch('Ứng dụng di Động')).toBe('ung dung di dong');
});

test('tuần bắt đầu thứ hai, chuyển qua tháng và năm đúng', () => {
  expect(weekDates(0, new Date(2027, 0, 3)).map(dateKey)).toEqual([
    '2026-12-28',
    '2026-12-29',
    '2026-12-30',
    '2026-12-31',
    '2027-01-01',
    '2027-01-02',
    '2027-01-03',
  ]);
  expect(dateKey(weekDates(1, now)[0])).toBe('2026-10-26');
  expect(dateKey(weekDates(-1, now)[0])).toBe('2026-10-12');
});

test('lịch lọc theo ngày, theo học kỳ và sắp xếp theo giờ', () => {
  expect(
    sessionsForDate(studySessions, now).map(item => item.startTime),
  ).toEqual(['07:30', '13:00']);
  expect(sessionsForDate(studySessions, new Date(2026, 9, 25))).toEqual([]);
  expect(sessionsForDate(studySessions, new Date(2027, 1, 1))).toEqual([]);
});

test('trạng thái phân biệt hôm nay, quá hạn, chưa hoàn thành và đã hoàn thành', () => {
  const assignment = createInitialStudyState(now).assignments[2];
  expect(assignmentStatus(assignment, now)).toBe('today');
  expect(assignmentStatus(assignment, new Date(2026, 9, 20))).toBe('overdue');
  expect(
    assignmentStatus({ ...assignment, completed: true }, new Date(2026, 9, 20)),
  ).toBe('completed');
  expect(
    assignmentStatus(createInitialStudyState(now).assignments[0], now),
  ).toBe('pending');
});

test('điểm và GPA tính theo trọng số, tín chỉ, xử lý danh sách rỗng', () => {
  const fixtures: Course[] = [3, 2, 1].map((credits, index) => ({
    id: `TEST-GPA-${index}`,
    name: `Môn kiểm thử ${index}`,
    credits,
    lecturer: 'Giảng viên kiểm thử',
    semester: 'Học kỳ kiểm thử',
    status: 'completed',
    description: 'Dữ liệu kiểm thử.',
  }));
  const results: StudyResult[] = fixtures.map((course, index) => ({
    id: `result-test-${index}`,
    courseId: course.id,
    components: [
      { name: 'Giữa kỳ', weight: 40, score: [10, 9, 2][index] },
      { name: 'Cuối kỳ', weight: 60, score: [7.5, 6.5, 4.5][index] },
    ],
  }));
  const originalLength = courses.length;
  courses.push(...fixtures);
  try {
    expect(gradeAverage(results[0])).toBe(8.5);
    expect(gradeAverage(results[1])).toBe(7.5);
    expect(gradeScale(8.49).letter).toBe('B');
    expect(gradeScale(8.5).letter).toBe('A');
    expect(gradeScale(3.99).point).toBe(0);
    expect(semesterSummary(results)).toEqual({
      credits: 6,
      passedCredits: 5,
      gpa: 3,
    });
    expect(semesterSummary([])).toEqual({
      credits: 0,
      passedCredits: 0,
      gpa: 0,
    });
  } finally {
    courses.splice(originalLength);
  }
});

test('kiểm tra họ tên, email và số điện thoại trước khi lưu', () => {
  expect(
    validateStudent({
      fullName: ' Hoàng Văn Hùng ',
      email: 'anh@example.com',
      phone: '+84 912 345 678',
    }),
  ).toEqual({});
  expect(
    Object.keys(
      validateStudent({ fullName: ' ', email: 'sai@', phone: '1234' }),
    ),
  ).toHaveLength(3);
});
