import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
  EmptyState,
  IconButton,
  AppHeader,
  FilterChips,
  Screen,
} from '../../components/study/StudyUI';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';

export default function ScheduleScreen({
  navigation,
}: TabScreenProps<'Schedule'>) {
  const { sessions } = useStudy();
  const now = useStudyClock();
  const [offset, setOffset] = useState(0);
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'Lý thuyết' | 'Thực hành'
  >('all');
  const [selectedDay, setSelectedDay] = useState(
    () => (new Date().getDay() + 6) % 7,
  );
  const dates = weekDates(offset, now);
  const selected = dates[selectedDay];
  const daySessions = sessionsForDate(sessions, selected);
  const items = daySessions.filter(
    session => typeFilter === 'all' || session.type === typeFilter,
  );
  const weeklyCount = dates.reduce(
    (sum, date) => sum + sessionsForDate(sessions, date).length,
    0,
  );
  return (
    <Screen
      header={
        <AppHeader
          title="Thời khóa biểu"
          subtitle={`${weeklyCount} buổi học trong tuần`}
          accessory={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Về lịch học hôm nay"
              onPress={() => {
                setOffset(0);
                setSelectedDay((now.getDay() + 6) % 7);
              }}
              style={styles.resetWeek}
            >
              <Text style={styles.resetLabel}>Hôm nay</Text>
            </Pressable>
          }
        />
      }
    >
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.calendar}>
              <View style={styles.weekControls}>
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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.days}
              >
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
                      style={styles.day}
                    >
                      <Text style={styles.dayCode}>
                        {dayCodes[date.getDay()]}
                      </Text>
                      <View
                        style={[
                          styles.dayCircle,
                          selectedDate && styles.selectedDay,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayNumber,
                            today && styles.todayNumber,
                            selectedDate && styles.white,
                          ]}
                        >
                          {date.getDate()}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.dot,
                          count > 0 && styles.hasClass,
                          selectedDate && count > 0 && styles.selectedDot,
                        ]}
                      />
                      <Text style={styles.today}>{today ? 'Nay' : ' '}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
            <FilterChips
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'Lý thuyết', label: 'Lý thuyết' },
                { value: 'Thực hành', label: 'Thực hành' },
              ]}
            />
            <View style={s.spread}>
              <Text style={s.heading}>
                {dayNames[selected.getDay()]}, {selected.getDate()}/
                {selected.getMonth() + 1}
              </Text>
              <Text style={styles.count}>{items.length} buổi học</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không có lịch học"
            message={
              daySessions.length
                ? 'Không có buổi học thuộc loại đang chọn. Thử xem tất cả buổi học.'
                : 'Bạn không có buổi học nào vào ngày này. Lịch mẫu áp dụng từ 07/09/2026 đến 17/01/2027.'
            }
            action={daySessions.length ? 'Xem tất cả buổi học' : undefined}
            onPress={() => setTypeFilter('all')}
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
  header: { gap: 12 },
  calendar: {
    backgroundColor: c.surface,
    padding: 12,
    borderRadius: 14,
    gap: 10,
  },
  weekControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resetWeek: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: c.primarySoft,
  },
  resetLabel: { fontSize: 12, fontWeight: '600', color: c.primary },
  count: { fontSize: 12, color: c.muted },
  range: { flex: 1, textAlign: 'center', fontSize: 13 },
  days: { flexDirection: 'row', flexGrow: 1 },
  day: {
    flex: 1,
    minHeight: 92,
    minWidth: 44,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  selectedDay: { backgroundColor: c.primary, borderColor: c.primary },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayNumber: { color: c.primary },
  white: { color: c.white },
  dayCode: { fontSize: 12, color: c.muted },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: c.text,
    fontVariant: ['tabular-nums'],
  },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'transparent' },
  hasClass: { backgroundColor: c.muted },
  selectedDot: { backgroundColor: c.primary },
  today: { fontSize: 10, color: c.primary },
});
