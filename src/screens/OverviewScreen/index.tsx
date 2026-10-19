import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import { useStudyClock } from '../../hooks/useStudyClock';
import { CURRENT_SEMESTER } from '../../data/studyData';
import type { TabScreenProps } from '../../types/navigation';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';
import { CourseCard } from '../../components/study/CourseCard';
import { AssignmentCard } from '../../components/study/AssignmentCard';
import {
  EmptyState,
  Metric,
  PageHeading,
  Screen,
  SectionHeading,
} from '../../components/study/StudyUI';

export default function OverviewScreen({
  navigation,
}: TabScreenProps<'Overview'>) {
  const { student, courses, assignments } = useStudy();
  const now = useStudyClock();
  const activeCourses = courses.filter(course => course.status === 'active');
  const pending = assignments.filter(item => !item.completed);
  const upcoming = pending
    .filter(item => new Date(item.dueDate).getTime() >= now.getTime())
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);
  const overdue =
    pending.length -
    pending.filter(item => new Date(item.dueDate).getTime() >= now.getTime())
      .length;
  return (
    <Screen>
      <FlatList
        data={activeCourses}
        keyExtractor={item => item.id}
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <PageHeading title="Tổng quan" subtitle={CURRENT_SEMESTER} />
            <View style={s.card}>
              <Text style={s.muted}>Xin chào,</Text>
              <Text style={s.title}>{student.fullName}</Text>
              <Text style={s.muted}>
                MSSV {student.id} · {student.className}
              </Text>
              <View style={s.divider} />
              <View style={s.row}>
                <Metric
                  value={String(activeCourses.length)}
                  label="Môn đang học"
                />
                <Metric
                  value={String(pending.length)}
                  label="Bài tập cần làm"
                />
              </View>
            </View>
            <View style={s.section}>
              <SectionHeading
                title="Bài tập sắp đến hạn"
                action="Tất cả"
                onPress={() => navigation.navigate('Assignments')}
              />
              {overdue > 0 && (
                <Text style={styles.warning}>
                  Bạn có {overdue} bài tập quá hạn cần hoàn thành.
                </Text>
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
                  title="Không có bài sắp đến hạn"
                  message="Các bài tập đã hoàn thành hoặc đã qua hạn nộp. Xem tất cả để kiểm tra."
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
  header: { gap: 16 },
  warning: { color: c.warning, fontSize: 13, lineHeight: 20 },
});
