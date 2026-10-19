import React from 'react';
import { View } from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import type { DetailScreenProps } from '../../types/navigation';
import {
  dayNames,
  findCourse,
  formatDate,
  sessionsForDate,
} from '../../utils/studyUtils';
import {
  Button,
  DetailPage,
  EmptyState,
  InfoRow,
  PageHeading,
} from '../../components/study/StudyUI';
import { studyStyles as s } from '../../theme/studyTheme';

export default function SessionDetailScreen({
  route,
  navigation,
}: DetailScreenProps<'SessionDetail'>) {
  const { sessions } = useStudy();
  const session = sessions.find(item => item.id === route.params.sessionId);
  const date = new Date(`${route.params.date}T12:00:00`);
  if (
    !session ||
    !Number.isFinite(date.getTime()) ||
    !sessionsForDate([session], date).length
  ) {
    return (
      <DetailPage>
        <EmptyState
          title="Không tìm thấy buổi học"
          message="Buổi học hoặc ngày học không hợp lệ."
          action="Quay lại"
          onPress={() => navigation.goBack()}
        />
      </DetailPage>
    );
  }
  const course = findCourse(session.courseId);
  return (
    <DetailPage>
      <PageHeading
        title={course?.name ?? session.courseId}
        subtitle={session.type}
      />
      <View style={s.card}>
        <InfoRow
          label="Ngày học"
          value={`${dayNames[date.getDay()]}, ${formatDate(date)}`}
        />
        <InfoRow
          label="Thời gian"
          value={`${session.startTime} – ${session.endTime}`}
        />
        <InfoRow label="Phòng học" value={session.room} />
        <InfoRow label="Mã môn học" value={session.courseId} />
        <InfoRow
          label="Giảng viên"
          value={course?.lecturer ?? 'Chưa cập nhật'}
        />
        <InfoRow
          label="Chuẩn bị trước buổi học"
          value={session.note || 'Không có ghi chú.'}
        />
      </View>
      <Button
        title="Xem chi tiết môn học"
        onPress={() =>
          navigation.navigate('CourseDetail', { courseId: session.courseId })
        }
      />
    </DetailPage>
  );
}
