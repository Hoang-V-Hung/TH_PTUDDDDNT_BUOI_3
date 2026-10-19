import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { Course } from '../../types/study';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';

export function CourseCard({
  course,
  onPress,
}: {
  course: Course;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.name}, ${course.id}, ${course.credits} tín chỉ. Xem chi tiết môn học`}
      onPress={onPress}
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      <View style={s.spread}>
        <Text style={s.muted}>
          {course.id} · {course.credits} tín chỉ
        </Text>
        <Icon name="chevron-forward" size={18} color={c.muted} />
      </View>
      <Text style={s.label}>{course.name}</Text>
      <Text style={s.muted}>{course.lecturer}</Text>
    </Pressable>
  );
}
