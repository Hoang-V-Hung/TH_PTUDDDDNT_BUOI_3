import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { StudySession } from '../../types/study';
import { findCourse } from '../../utils/studyUtils';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';

export function SessionCard({
  session,
  onPress,
}: {
  session: StudySession;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && s.pressed]}
    >
      <View style={styles.time}>
        <Text style={styles.start}>{session.startTime}</Text>
        <Text style={s.muted}>{session.endTime}</Text>
        <View style={styles.timeLine} />
      </View>
      <View style={[s.card, s.grow, styles.card]}>
        <View style={s.spread}>
          <Text style={styles.code}>{session.courseId}</Text>
          <Icon name="chevron-forward" color={c.muted} size={15} />
        </View>
        <Text style={s.label}>
          {findCourse(session.courseId)?.name ?? session.courseId}
        </Text>
        <View style={styles.meta}>
          <Icon name="location-outline" size={14} color={c.muted} />
          <Text style={s.muted}>
            {session.room} · {session.type}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  time: { width: 48, alignItems: 'center', paddingTop: 14, gap: 3 },
  start: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: c.text,
    fontVariant: ['tabular-nums'],
  },
  timeLine: {
    width: 2,
    flex: 1,
    minHeight: 12,
    backgroundColor: c.border,
    marginTop: 5,
    borderRadius: 1,
  },
  card: {
    gap: 7,
    borderLeftWidth: 3,
    borderLeftColor: c.primary,
    padding: 14,
    borderRadius: 16,
  },
  code: {
    fontSize: 11,
    fontWeight: '700',
    color: c.primary,
    letterSpacing: 0.3,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
