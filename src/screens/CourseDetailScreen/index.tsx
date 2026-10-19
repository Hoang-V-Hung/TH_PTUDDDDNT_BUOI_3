import React from 'react';
import { Text, View } from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import { useStudyClock } from '../../hooks/useStudyClock';
import type { DetailScreenProps } from '../../types/navigation';
import {
  dayNames,
  weekDates,
  dateKey,
  sessionsForDate,
} from '../../utils/studyUtils';
import { AssignmentCard } from '../../components/study/AssignmentCard';
import {
  Button,
  DetailPage,
  EmptyState,
  InfoRow,
  PageHeading,
  SectionHeading,
} from '../../components/study/StudyUI';
import { studyStyles as s } from '../../theme/studyTheme';

export default function CourseDetailScreen({
  navigation,
  route,
}: DetailScreenProps<'CourseDetail'>) {
  const { courses, assignments, sessions, results } = useStudy();
  const now = useStudyClock();
  const course = courses.find(item => item.id === route.params.courseId);
  if (!course) {
    return (
      <DetailPage>
        <EmptyState
          title="Không tìm thấy môn học"
          message="Môn học này không có trong danh sách hiện tại."
          action="Quay lại"
          onPress={() => navigation.goBack()}
        />
      </DetailPage>
    );
  }
  const courseAssignments = assignments
    .filter(item => item.courseId === course.id)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const courseSessions = sessions.filter(item => item.courseId === course.id);
  const result = results.find(item => item.courseId === course.id);
  return (
    <DetailPage>
      <PageHeading
        title={course.name}
        subtitle={`${course.id} · ${course.credits} tín chỉ`}
      />
      <View style={s.card}>
        <InfoRow label="Học kỳ" value={course.semester} />
        <InfoRow label="Giảng viên" value={course.lecturer} />
        <InfoRow
          label="Trạng thái"
          value={course.status === 'active' ? 'Đang học' : 'Đã hoàn thành'}
        />
        <InfoRow label="Giới thiệu môn học" value={course.description} />
      </View>
      {result && (
        <Button
          title="Xem kết quả học tập"
          onPress={() =>
            navigation.navigate('GradeDetail', { resultId: result.id })
          }
        />
      )}
      <SectionHeading title="Lịch học hàng tuần" />
      {courseSessions.length ? (
        courseSessions.map(session => {
          const nextDate = [...weekDates(0, now), ...weekDates(1, now)].find(
            date =>
              dateKey(date) >= dateKey(now) &&
              sessionsForDate([session], date).length > 0,
          );
          return (
            <View key={session.id} style={s.card}>
              <Text style={s.label}>
                {dayNames[session.dayOfWeek]} · {session.startTime} –{' '}
                {session.endTime}
              </Text>
              <Text style={s.muted}>
                Phòng {session.room} · {session.type}
              </Text>
              {nextDate && (
                <Button
                  title="Chi tiết buổi học sắp tới"
                  onPress={() =>
                    navigation.navigate('SessionDetail', {
                      sessionId: session.id,
                      date: dateKey(nextDate),
                    })
                  }
                />
              )}
            </View>
          );
        })
      ) : (
        <EmptyState
          title="Chưa có lịch học"
          message="Môn học này không có lịch trong học kỳ hiện tại."
        />
      )}
      <SectionHeading title="Bài tập của môn" />
      {courseAssignments.length ? (
        courseAssignments.map(item => (
          <AssignmentCard
            key={item.id}
            assignment={item}
            now={now}
            onPress={() =>
              navigation.navigate('AssignmentDetail', { assignmentId: item.id })
            }
          />
        ))
      ) : (
        <EmptyState
          title="Chưa có bài tập"
          message="Chưa có bài tập nào được giao cho môn học này."
        />
      )}
    </DetailPage>
  );
}
