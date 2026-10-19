/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import { createInitialStudyState } from '../src/data/studyData';

test('hiển thị 5 tab và tổng quan có thông tin sinh viên', async () => {
  await AsyncStorage.clear();
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  try {
    const output = renderer!.root
      .findAllByType(Text)
      .flatMap(node => node.props.children)
      .filter(child => typeof child === 'string' || typeof child === 'number')
      .join(' ');
    for (const label of [
      'Tổng quan',
      'Môn học',
      'Lịch học',
      'Bài tập',
      'Cá nhân',
      createInitialStudyState().student.fullName,
      createInitialStudyState().student.id,
    ]) {
      expect(output).toContain(label);
    }
  } finally {
    await ReactTestRenderer.act(async () => renderer!.unmount());
  }
}, 60000);
