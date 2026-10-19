import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyProvider, useStudy } from '../src/contexts/StudyContext';
import {
  loadStudyState,
  STUDY_BACKUP_KEY,
  STUDY_STORAGE_KEY,
} from '../src/services/studyStorage';

let context: ReturnType<typeof useStudy>;
let renderer: TestRenderer.ReactTestRenderer;
function Harness() {
  context = useStudy();
  return null;
}
async function mount() {
  await act(async () => {
    renderer = TestRenderer.create(
      <StudyProvider>
        <Harness />
      </StudyProvider>,
    );
  });
}
beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});
afterEach(async () => {
  if (renderer) {
    await act(async () => renderer.unmount());
  }
});

test('cập nhật liên tiếp vẫn lưu đủ hồ sơ và trạng thái bài tập; mở lại không mất dữ liệu', async () => {
  await mount();
  const originalDeadline = context.assignments[0].dueDate;
  await act(async () => {
    await Promise.all([
      context.toggleAssignment('assignment-1'),
      context.toggleAssignment('assignment-2'),
      context.updateStudent({
        fullName: 'Trần Minh An',
        email: 'an@example.com',
        phone: '0987654321',
      }),
    ]);
  });
  expect(context.student.fullName).toBe('Trần Minh An');
  expect(context.assignments.slice(0, 2).every(item => item.completed)).toBe(
    true,
  );
  expect((await loadStudyState())?.student.fullName).toBe('Trần Minh An');
  await act(async () => renderer.unmount());
  await mount();
  expect(context.assignments[0].dueDate).toBe(originalDeadline);
  expect(context.assignments[0].completed).toBe(true);
  expect(context.student.fullName).toBe('Trần Minh An');
});

test('lỗi ghi có thông báo và có thể thử lại', async () => {
  await mount();
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('Đầy bộ nhớ'));
  await act(async () => {
    expect(await context.toggleAssignment('assignment-1')).toBe(false);
  });
  expect(context.storageError).toBeTruthy();
  await act(async () => {
    await context.retryStorage();
  });
  expect(context.storageError).toBeNull();
  expect((await loadStudyState())?.assignments[0].completed).toBe(true);
});

test('cache hỏng không bị dữ liệu mẫu ghi đè', async () => {
  await AsyncStorage.setItem(STUDY_STORAGE_KEY, '{');
  await mount();
  expect(context.loading).toBe(false);
  expect(context.storageError).toBeTruthy();
  await act(async () => {
    expect(await context.toggleAssignment('assignment-1')).toBe(false);
  });
  expect(await AsyncStorage.getItem(STUDY_STORAGE_KEY)).toBe('{');
  expect(context.canRestoreDefaults).toBe(true);
  await act(async () => {
    await context.restoreDefaults();
  });
  expect(context.storageError).toBeNull();
  expect(context.canRestoreDefaults).toBe(false);
  expect(await AsyncStorage.getItem(STUDY_BACKUP_KEY)).toBe('{');
  await act(async () => {
    expect(await context.toggleAssignment('assignment-1')).toBe(true);
  });
});
