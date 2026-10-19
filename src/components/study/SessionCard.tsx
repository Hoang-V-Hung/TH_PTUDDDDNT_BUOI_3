import React from 'react';
import { Pressable, Text, View } from 'react-native';
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
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      <View style={s.spread}>
        <Text style={s.label}>
          {session.startTime} – {session.endTime}
        </Text>
        <Icon name="chevron-forward" color={c.muted} size={18} />
      </View>
      <Text style={s.heading}>
        {findCourse(session.courseId)?.name ?? session.courseId}
      </Text>
      <Text style={s.muted}>
        {session.type} · Phòng {session.room}
      </Text>
    </Pressable>
  );
}
