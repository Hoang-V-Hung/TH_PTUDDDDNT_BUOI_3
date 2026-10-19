import React from 'react';
import { Text, View } from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import type { DetailScreenProps } from '../../types/navigation';
import { findCourse, gradeAverage, gradeScale } from '../../utils/studyUtils';
import {
  Button,
  DetailPage,
  EmptyState,
  InfoRow,
  Metric,
  PageHeading,
  SectionHeading,
} from '../../components/study/StudyUI';
import { studyStyles as s, studyColors as c } from '../../theme/studyTheme';

export default function GradeDetailScreen({
  route,
  navigation,
}: DetailScreenProps<'GradeDetail'>) {
  const { results } = useStudy();
  const result = results.find(item => item.id === route.params.resultId);
  if (!result) {
    return (
      <DetailPage>
        <EmptyState
          title="Chưa có kết quả"
          message="Không tìm thấy kết quả học tập được chọn."
          action="Quay lại"
          onPress={() => navigation.goBack()}
        />
      </DetailPage>
    );
  }
  const course = findCourse(result.courseId);
  const average = gradeAverage(result);
  const grade = gradeScale(average);
  return (
    <DetailPage>
      <PageHeading
        detail
        title={course?.name ?? result.courseId}
        subtitle={course?.semester}
      />
      <View
        style={[
          s.card,
          { backgroundColor: c.primarySoft, borderColor: c.primarySoft },
        ]}
      >
        <View style={s.row}>
          <Metric value={average.toFixed(2)} label="Điểm tổng kết / 10" />
          <Metric
            value={grade.letter}
            label={`${grade.point.toFixed(1)} / 4 · ${grade.label}`}
          />
        </View>
        <View style={s.divider} />
        <InfoRow label="Mã môn học" value={result.courseId} />
        <InfoRow label="Số tín chỉ" value={String(course?.credits ?? 0)} />
      </View>
      <SectionHeading title="Điểm thành phần" />
      <View style={s.card}>
        {result.components.map(part => (
          <View key={part.name} style={s.spread}>
            <View style={s.grow}>
              <Text style={s.label}>{part.name}</Text>
              <Text style={s.muted}>Trọng số {part.weight}%</Text>
            </View>
            <Text style={s.heading}>{part.score.toFixed(1)}</Text>
          </View>
        ))}
        <View style={s.divider} />
        <Text style={s.muted}>
          Điểm tổng kết = tổng (điểm thành phần × trọng số). GPA học kỳ tính
          theo số tín chỉ, dùng điểm tổng kết trước khi làm tròn hiển thị.
        </Text>
      </View>
      <Text style={s.muted}>
        Quy đổi minh họa: A ≥ 8,5; B ≥ 7,0; C ≥ 5,5; D ≥ 4,0; F dưới 4,0. Đây là
        dữ liệu mẫu, chưa liên kết hệ thống nhà trường.
      </Text>
      <Button
        title="Xem chi tiết môn học"
        onPress={() =>
          navigation.navigate('CourseDetail', { courseId: result.courseId })
        }
      />
    </DetailPage>
  );
}
