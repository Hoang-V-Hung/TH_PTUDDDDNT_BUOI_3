import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStudy } from '../../contexts/StudyContext';
import { useStudyClock } from '../../hooks/useStudyClock';
import { CURRENT_SEMESTER } from '../../data/studyData';
import type { TabScreenProps } from '../../types/navigation';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';
import { CourseCard } from '../../components/study/CourseCard';
import { AssignmentCard } from '../../components/study/AssignmentCard';
import { SessionCard } from '../../components/study/SessionCard';
import { dateKey, dayNames, sessionsForDate } from '../../utils/studyUtils';
import {
  AppHeader,
  EmptyState,
  Avatar,
  Metric,
  Screen,
  SectionHeading,
} from '../../components/study/StudyUI';

export default function OverviewScreen({
  navigation,
}: TabScreenProps<'Overview'>) {
  const { student, courses, assignments, sessions } = useStudy();
  const now = useStudyClock();
  const activeCourses = courses.filter(course => course.status === 'active');
  const pending = assignments.filter(item => !item.completed);
  const upcoming = pending
    .filter(item => new Date(item.dueDate).getTime() >= now.getTime())
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 2);
  const overdue =
    pending.length -
    pending.filter(item => new Date(item.dueDate).getTime() >= now.getTime())
      .length;
  const todaySessions = sessionsForDate(sessions, now);
  const actions = [
    {
      title: 'Môn học',
      icon: 'school-outline',
      onPress: () => navigation.navigate('Courses'),
    },
    {
      title: 'Lịch học',
      icon: 'calendar-outline',
      onPress: () => navigation.navigate('Schedule'),
    },
    {
      title: 'Bài tập',
      icon: 'checkbox-outline',
      onPress: () => navigation.navigate('Assignments'),
    },
    {
      title: 'Kết quả',
      icon: 'stats-chart-outline',
      onPress: () => navigation.navigate('AcademicResults'),
    },
  ];
  return (
    <Screen
      header={
        <AppHeader
          eyebrow="SỔ TAY HỌC TẬP"
          title={student.fullName}
          subtitle={`MSSV ${student.id} · ${student.className}`}
          accessory={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xem thông tin cá nhân"
              onPress={() => navigation.navigate('Profile')}
            >
              <Avatar name={student.fullName} />
            </Pressable>
          }
        />
      }
    >
      <FlatList
        data={activeCourses}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.semester}>{CURRENT_SEMESTER}</Text>
            <View style={[s.card, styles.metrics]}>
              <Metric
                value={String(activeCourses.length)}
                label="Môn đang học"
              />
              <Metric
                value={String(
                  activeCourses.reduce((sum, item) => sum + item.credits, 0),
                )}
                label="Tín chỉ"
              />
              <Metric value={String(pending.length)} label="Bài cần làm" />
            </View>
            <View style={s.section}>
              <SectionHeading title="Chức năng" />
              <View style={[s.card, styles.quickActions]}>
                {actions.map(action => (
                  <Pressable
                    key={action.title}
                    accessibilityRole="button"
                    accessibilityLabel={action.title}
                    onPress={action.onPress}
                    style={({ pressed }) => [
                      styles.quickAction,
                      pressed && s.pressed,
                    ]}
                  >
                    <View style={styles.quickIcon}>
                      <Icon name={action.icon} size={25} color={c.primary} />
                    </View>
                    <Text style={styles.quickLabel}>{action.title}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={s.section}>
              <SectionHeading
                title="Lịch học hôm nay"
                action="Xem lịch"
                onPress={() => navigation.navigate('Schedule')}
              />
              <Text style={s.muted}>
                {dayNames[now.getDay()]}, {now.getDate()}/{now.getMonth() + 1}/
                {now.getFullYear()}
              </Text>
              {todaySessions.length ? (
                todaySessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onPress={() =>
                      navigation.navigate('SessionDetail', {
                        sessionId: session.id,
                        date: dateKey(now),
                      })
                    }
                  />
                ))
              ) : (
                <EmptyState
                  title="Hôm nay không có lớp"
                  message="Xem lịch các ngày tiếp theo để chuẩn bị cho buổi học."
                  action="Xem lịch học"
                  onPress={() => navigation.navigate('Schedule')}
                />
              )}
            </View>
            <View style={s.section}>
              <SectionHeading
                title="Bài tập sắp đến hạn"
                action="Tất cả"
                onPress={() => navigation.navigate('Assignments')}
              />
              {overdue > 0 && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigation.navigate('Assignments')}
                  style={styles.notice}
                >
                  <Icon
                    name="alert-circle-outline"
                    size={18}
                    color={c.warning}
                  />
                  <Text style={styles.warning}>
                    {overdue} bài đã quá hạn. Kiểm tra ngay nhé!
                  </Text>
                  <Icon name="chevron-forward" size={15} color={c.warning} />
                </Pressable>
              )}
              {upcoming.length ? (
                upcoming.map(item => (
                  <AssignmentCard
                    key={item.id}
                    assignment={item}
                    now={now}
                    onPress={() =>
                      navigation.navigate('AssignmentDetail', {
                        assignmentId: item.id,
                      })
                    }
                  />
                ))
              ) : (
                <EmptyState
                  title={
                    pending.length
                      ? 'Không có bài sắp đến hạn'
                      : 'Bạn đã hoàn thành tất cả!'
                  }
                  message={
                    pending.length
                      ? 'Các bài còn lại đã quá hạn. Xem tất cả để kiểm tra.'
                      : 'Hiện không có bài tập nào cần làm.'
                  }
                  action={pending.length ? 'Xem bài tập' : undefined}
                  onPress={() => navigation.navigate('Assignments')}
                />
              )}
            </View>
            <SectionHeading
              title="Môn học đang học"
              action="Tất cả"
              onPress={() => navigation.navigate('Courses')}
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Chưa có môn học"
            message="Danh sách môn học của học kỳ này đang trống."
          />
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate('CourseDetail', { courseId: item.id })
            }
          />
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { gap: 10 },
  semester: { fontSize: 12, fontWeight: '600', color: c.muted },
  metrics: { flexDirection: 'row', gap: 12, paddingVertical: 18 },
  quickActions: { flexDirection: 'row', padding: 10, gap: 4 },
  quickAction: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: 9,
    paddingVertical: 8,
  },
  quickIcon: {
    width: 48,
    height: 48,
    backgroundColor: c.primarySoft,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: c.text,
    textAlign: 'center',
  },
  notice: {
    backgroundColor: c.warningSoft,
    borderRadius: 12,
    padding: 12,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warning: { flex: 1, color: c.warning, fontSize: 12, lineHeight: 19 },
});
