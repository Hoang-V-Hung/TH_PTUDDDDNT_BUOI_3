import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import type { TabScreenProps } from '../../types/navigation';
import { normalizeSearch } from '../../utils/studyUtils';
import { CourseCard } from '../../components/study/CourseCard';
import {
  AppHeader,
  EmptyState,
  SearchField,
  Screen,
} from '../../components/study/StudyUI';
import { SemesterPicker } from '../../components/study/SemesterPicker';
import { studyStyles as s } from '../../theme/studyTheme';
import { CURRENT_SEMESTER } from '../../data/studyData';

export default function CoursesScreen({
  navigation,
}: TabScreenProps<'Courses'>) {
  const { courses } = useStudy();
  const { width, fontScale } = useWindowDimensions();
  const columns = width < 360 || fontScale > 1.2 ? 1 : 2;
  const [query, setQuery] = useState('');
  const semesters = [...new Set(courses.map(course => course.semester))];
  const [semester, setSemester] = useState<string | null>(() =>
    semesters.includes(CURRENT_SEMESTER)
      ? CURRENT_SEMESTER
      : semesters[0] ?? null,
  );
  const keyword = normalizeSearch(query);
  const filtered = courses.filter(
    course =>
      (!semester || course.semester === semester) &&
      normalizeSearch(`${course.name} ${course.id}`).includes(keyword),
  );
  return (
    <Screen
      header={
        <AppHeader title="Môn học" subtitle="Danh sách môn học theo học kỳ" />
      }
    >
      <FlatList
        key={columns}
        numColumns={columns}
        data={filtered}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={columns > 1 ? styles.columns : undefined}
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <SemesterPicker
              value={semester}
              options={semesters}
              onChange={setSemester}
              summary={`${filtered.length} môn học · ${filtered.reduce(
                (sum, item) => sum + item.credits,
                0,
              )} tín chỉ`}
            />
            <SearchField
              label="Tìm kiếm môn học"
              placeholder="Tên hoặc mã môn học"
              value={query}
              onChangeText={setQuery}
            />
            <Text style={s.muted}>{filtered.length} môn học</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            message={
              query.trim()
                ? `Không có môn phù hợp với “${query.trim()}” trong học kỳ này.`
                : 'Chưa có môn học trong học kỳ này.'
            }
            action="Xóa tìm kiếm và bộ lọc"
            onPress={() => {
              setQuery('');
              setSemester(null);
            }}
          />
        }
        renderItem={({ item }) => (
          <View style={columns > 1 ? styles.gridCell : s.grow}>
            <CourseCard
              course={item}
              grid={columns > 1}
              onPress={() =>
                navigation.navigate('CourseDetail', { courseId: item.id })
              }
            />
          </View>
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { gap: 14 },
  columns: { gap: 12, alignItems: 'stretch' },
  gridCell: { width: '48%', flexGrow: 0, flexShrink: 1 },
});
