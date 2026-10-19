import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStudy } from '../../contexts/StudyContext';
import { SemesterPicker } from '../../components/study/SemesterPicker';
import {
  EmptyState,
  Metric,
  Screen,
  SectionHeading,
} from '../../components/study/StudyUI';
import { RESULT_SEMESTER } from '../../data/studyData';
import type { DetailScreenProps } from '../../types/navigation';
import {
  findCourse,
  gradeAverage,
  gradeScale,
  semesterSummary,
} from '../../utils/studyUtils';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';

export default function AcademicResultsScreen({
  navigation,
}: DetailScreenProps<'AcademicResults'>) {
  const { results } = useStudy();
  const semesters = [
    ...new Set(
      results
        .map(item => findCourse(item.courseId)?.semester)
        .filter((item): item is string => Boolean(item)),
    ),
  ];
  const [semester, setSemester] = useState<string | null>(() =>
    semesters.includes(RESULT_SEMESTER)
      ? RESULT_SEMESTER
      : semesters[0] ?? null,
  );
  const items = results.filter(
    item => !semester || findCourse(item.courseId)?.semester === semester,
  );
  const summary = semesterSummary(items);
  return (
    <Screen detail>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <SemesterPicker
              value={semester}
              options={semesters}
              onChange={setSemester}
              summary={`${items.length} môn học · ${summary.credits} tín chỉ`}
            />
            <View style={[s.card, styles.summary]}>
              <View style={s.row}>
                <Metric
                  value={summary.gpa.toFixed(2)}
                  label={semester ? 'GPA học kỳ / 4' : 'GPA các kết quả / 4'}
                />
                <View style={styles.verticalDivider} />
                <Metric
                  value={String(summary.passedCredits)}
                  label="Tín chỉ đạt"
                />
              </View>
            </View>
            <SectionHeading title="Kết quả từng môn" />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Chưa có kết quả"
            message="Kết quả các môn đã hoàn thành sẽ hiển thị tại đây."
          />
        }
        renderItem={({ item }) => {
          const course = findCourse(item.courseId);
          const average = gradeAverage(item);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Kết quả ${
                course?.name ?? item.courseId
              }, ${average.toFixed(2)} điểm`}
              onPress={() =>
                navigation.navigate('GradeDetail', { resultId: item.id })
              }
              style={({ pressed }) => [s.card, s.spread, pressed && s.pressed]}
            >
              <View style={[s.grow, styles.copy]}>
                <Text style={s.label}>{course?.name ?? item.courseId}</Text>
                <Text style={s.muted}>
                  {item.courseId} · {course?.credits ?? 0} tín chỉ
                </Text>
              </View>
              <View style={styles.grade}>
                <Text style={styles.letter}>{gradeScale(average).letter}</Text>
                <Text style={s.muted}>{average.toFixed(2)}</Text>
              </View>
              <Icon name="chevron-forward" size={16} color={c.muted} />
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { gap: 14 },
  summary: { backgroundColor: c.primarySoft, borderColor: c.primarySoft },
  verticalDivider: { width: 1, height: 46, backgroundColor: c.inputBorder },
  copy: { gap: 5 },
  grade: { minWidth: 42, alignItems: 'center', gap: 3 },
  letter: { color: c.primary, fontSize: 21, fontWeight: '700' },
});
