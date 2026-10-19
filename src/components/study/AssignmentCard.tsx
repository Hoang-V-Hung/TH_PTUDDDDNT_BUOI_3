import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { Assignment } from '../../types/study';
import { useStudy } from '../../contexts/StudyContext';
import {
  assignmentStatus,
  findCourse,
  formatDeadline,
} from '../../utils/studyUtils';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';
import { StatusBadge } from './StudyUI';

export function AssignmentCard({
  assignment,
  now,
  onPress,
}: {
  assignment: Assignment;
  now: Date;
  onPress: () => void;
}) {
  const { toggleAssignment } = useStudy();
  const [saving, setSaving] = useState(false);
  const status = assignmentStatus(assignment, now);
  async function toggle() {
    setSaving(true);
    try {
      await toggleAssignment(assignment.id);
    } finally {
      setSaving(false);
    }
  }
  return (
    <View style={[s.card, styles.card]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={`Hoàn thành: ${assignment.title}`}
        accessibilityState={{ checked: assignment.completed, disabled: saving }}
        disabled={saving}
        onPress={() => {
          toggle();
        }}
        style={styles.checkbox}
      >
        <Icon
          name={assignment.completed ? 'checkbox' : 'square-outline'}
          size={26}
          color={assignment.completed ? c.success : c.muted}
        />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Chi tiết bài tập: ${assignment.title}`}
        onPress={onPress}
        style={({ pressed }) => [s.grow, styles.details, pressed && s.pressed]}
      >
        <Text style={s.muted}>
          {findCourse(assignment.courseId)?.name ?? assignment.courseId}
        </Text>
        <Text style={s.label}>{assignment.title}</Text>
        <Text style={[s.muted, status === 'overdue' && styles.overdue]}>
          Hạn: {formatDeadline(assignment.dueDate)}
        </Text>
        <StatusBadge status={status} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 8,
    alignItems: 'flex-start',
  },
  checkbox: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: { gap: 8, minHeight: 44 },
  overdue: { color: c.warning },
});
