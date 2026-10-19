import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import { useStudyClock } from '../../hooks/useStudyClock';
import type { DetailScreenProps } from '../../types/navigation';
import {
  assignmentStatus,
  findCourse,
  formatDeadline,
} from '../../utils/studyUtils';
import {
  Button,
  DetailPage,
  EmptyState,
  InfoRow,
  PageHeading,
  StatusBadge,
} from '../../components/study/StudyUI';
import { studyStyles as s } from '../../theme/studyTheme';

export default function AssignmentDetailScreen({
  route,
  navigation,
}: DetailScreenProps<'AssignmentDetail'>) {
  const { assignments, toggleAssignment } = useStudy();
  const now = useStudyClock();
  const [saving, setSaving] = useState(false);
  const item = assignments.find(
    assignment => assignment.id === route.params.assignmentId,
  );
  if (!item) {
    return (
      <DetailPage>
        <EmptyState
          title="Không tìm thấy bài tập"
          message="Bài tập này không có trong danh sách hiện tại."
          action="Quay lại"
          onPress={() => navigation.goBack()}
        />
      </DetailPage>
    );
  }
  async function toggle() {
    if (!item) {
      return;
    }
    setSaving(true);
    try {
      await toggleAssignment(item.id);
    } finally {
      setSaving(false);
    }
  }
  return (
    <DetailPage>
      <PageHeading
        detail
        title={item.title}
        subtitle={findCourse(item.courseId)?.name ?? item.courseId}
      />
      <View style={s.card}>
        <StatusBadge status={assignmentStatus(item, now)} />
        <InfoRow
          label="Hạn nộp"
          value={formatDeadline(item.dueDate)}
          icon="time-outline"
        />
        <InfoRow label="Mã môn học" value={item.courseId} icon="book-outline" />
        <View style={s.divider} />
        <Text style={s.heading}>Yêu cầu bài tập</Text>
        <Text selectable style={s.body}>
          {item.description}
        </Text>
      </View>
      <Button
        primary
        title={
          saving
            ? 'Đang lưu…'
            : item.completed
            ? 'Đánh dấu chưa hoàn thành'
            : 'Đánh dấu đã hoàn thành'
        }
        disabled={saving}
        onPress={() => {
          toggle();
        }}
      />
      <Button
        title="Xem chi tiết môn học"
        onPress={() =>
          navigation.navigate('CourseDetail', { courseId: item.courseId })
        }
      />
    </DetailPage>
  );
}
