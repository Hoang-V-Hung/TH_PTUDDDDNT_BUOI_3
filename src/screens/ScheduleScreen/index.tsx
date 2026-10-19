import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import { useStudyClock } from '../../hooks/useStudyClock';
import type { TabScreenProps } from '../../types/navigation';
import {
  dateKey,
  dayCodes,
  dayNames,
  formatDate,
  sessionsForDate,
  weekDates,
} from '../../utils/studyUtils';
import { SessionCard } from '../../components/study/SessionCard';
import {
  Button,
  EmptyState,
  IconButton,
  PageHeading,
  Screen,
} from '../../components/study/StudyUI';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';

export default function ScheduleScreen({
  navigation,
}: TabScreenProps<'Schedule'>) {
  const { sessions } = useStudy();
  const now = useStudyClock();
  const [offset, setOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(
    () => (new Date().getDay() + 6) % 7,
  );
  const dates = weekDates(offset, now);
  const selected = dates[selectedDay];
  const items = sessionsForDate(sessions, selected);
  const weeklyCount = dates.reduce(
    (sum, date) => sum + sessionsForDate(sessions, date).length,
    0,
  );
  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <PageHeading
              title="Thời khóa biểu"
              subtitle={`${weeklyCount} buổi học trong tuần`}
            />
            <View style={s.spread}>
              <IconButton
                name="chevron-back"
                label="Tuần trước"
                onPress={() => setOffset(value => value - 1)}
              />
              <Text style={[s.label, styles.range]}>
                {formatDate(dates[0])} – {formatDate(dates[6])}
              </Text>
              <IconButton
                name="chevron-forward"
                label="Tuần sau"
                onPress={() => setOffset(value => value + 1)}
              />
            </View>
            <Button
              title="Tuần này"
              onPress={() => {
                setOffset(0);
                setSelectedDay((now.getDay() + 6) % 7);
              }}
            />
            <View style={styles.days}>
              {dates.map((date, index) => {
                const selectedDate = selectedDay === index;
                const today = dateKey(date) === dateKey(now);
                const count = sessionsForDate(sessions, date).length;
                return (
                  <Pressable
                    key={dateKey(date)}
                    accessibilityRole="button"
                    accessibilityLabel={`${
                      dayNames[date.getDay()]
                    }, ${formatDate(date)}, ${count} buổi học${
                      today ? ', hôm nay' : ''
                    }`}
                    accessibilityState={{ selected: selectedDate }}
                    onPress={() => setSelectedDay(index)}
                    style={[styles.day, selectedDate && styles.selectedDay]}
                  >
                    <Text
                      style={[styles.dayCode, selectedDate && styles.white]}
                    >
                      {dayCodes[date.getDay()]}
                    </Text>
                    <Text
                      style={[styles.dayNumber, selectedDate && styles.white]}
                    >
                      {date.getDate()}
                    </Text>
                    <View
                      style={[
                        styles.dot,
                        count > 0 && styles.hasClass,
                        selectedDate && count > 0 && styles.selectedDot,
                      ]}
                    />
                    {today && (
                      <Text
                        style={[styles.today, selectedDate && styles.white]}
                      >
                        Nay
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
            <Text style={s.heading}>
              {dayNames[selected.getDay()]}, {formatDate(selected)}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không có lịch học"
            message="Bạn không có buổi học nào vào ngày này. Lịch mẫu áp dụng từ 07/09/2026 đến 17/01/2027."
          />
        }
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate('SessionDetail', {
                sessionId: item.id,
                date: dateKey(selected),
              })
            }
          />
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { gap: 16 },
  range: { flex: 1, textAlign: 'center', fontSize: 13 },
  days: { flexDirection: 'row', gap: 4 },
  day: {
    flex: 1,
    minHeight: 94,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 5,
    borderRadius: 12,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  selectedDay: { backgroundColor: c.primary, borderColor: c.primary },
  white: { color: c.white },
  dayCode: { fontSize: 12, color: c.muted },
  dayNumber: { fontSize: 17, fontWeight: '600', color: c.text },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'transparent' },
  hasClass: { backgroundColor: c.muted },
  selectedDot: { backgroundColor: c.white },
  today: { fontSize: 10, color: c.primary },
});
