import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { Course } from '../../types/study';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';

const courseIcons: Record<string, string> = {
  RIPT1412: 'phone-portrait-outline',
  INT1448: 'layers-outline',
  RIPT1411: 'code-slash-outline',
  RIPT1413: 'analytics-outline',
  INT1416: 'shield-checkmark-outline',
  BAS1153: 'library-outline',
};

export function CourseGlyph({ courseId }: { courseId: string }) {
  return (
    <View style={styles.glyph}>
      <Icon
        name={courseIcons[courseId] ?? 'book-outline'}
        size={23}
        color={c.primary}
      />
    </View>
  );
}

export function CourseCard({
  course,
  onPress,
  grid = false,
}: {
  course: Course;
  onPress: () => void;
  grid?: boolean;
}) {
  if (grid) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${course.name}, ${course.id}, ${course.credits} tín chỉ. Xem chi tiết môn học`}
        onPress={onPress}
        style={({ pressed }) => [s.card, styles.gridCard, pressed && s.pressed]}
      >
        <View style={s.spread}>
          <Text style={styles.creditBadge}>{course.credits} tín chỉ</Text>
          <Icon
            name={courseIcons[course.id] ?? 'book-outline'}
            size={20}
            color={c.primary}
          />
        </View>
        <Text style={[s.label, styles.gridTitle]}>{course.name}</Text>
        <View style={styles.copy}>
          <Text style={styles.code}>{course.id}</Text>
          <Text style={s.muted}>
            {course.status === 'active' ? 'Đang học' : 'Đã hoàn thành'}
          </Text>
        </View>
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.name}, ${course.id}, ${course.credits} tín chỉ. Xem chi tiết môn học`}
      onPress={onPress}
      style={({ pressed }) => [s.card, styles.card, pressed && s.pressed]}
    >
      <CourseGlyph courseId={course.id} />
      <View style={[s.grow, styles.copy]}>
        <Text style={styles.code}>
          {course.id}{' '}
          <Text style={styles.credits}> · {course.credits} tín chỉ</Text>
        </Text>
        <Text style={s.label}>{course.name}</Text>
        <Text style={s.muted}>{course.lecturer}</Text>
      </View>
      <Icon name="chevron-forward" size={17} color={c.muted} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  gridCard: {
    flex: 1,
    minHeight: 180,
    padding: 14,
    gap: 14,
    borderLeftWidth: 3,
    borderLeftColor: c.primary,
  },
  gridTitle: { flex: 1 },
  creditBadge: {
    fontSize: 11,
    lineHeight: 18,
    color: c.primary,
    backgroundColor: c.primarySoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { gap: 5 },
  code: {
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '700',
    color: c.primary,
    letterSpacing: 0.3,
  },
  credits: { color: c.muted, fontWeight: '400', letterSpacing: 0 },
  glyph: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.primarySoft,
  },
});
