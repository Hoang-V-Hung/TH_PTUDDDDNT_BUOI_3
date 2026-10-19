import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import type { TabScreenProps } from '../../types/navigation';
import { normalizeSearch } from '../../utils/studyUtils';
import { CourseCard } from '../../components/study/CourseCard';
import {
  Button,
  EmptyState,
  Field,
  FilterChips,
  PageHeading,
  Screen,
} from '../../components/study/StudyUI';
import { studyStyles as s } from '../../theme/studyTheme';

type CourseFilter = 'active' | 'completed' | 'all';
export default function CoursesScreen({
  navigation,
}: TabScreenProps<'Courses'>) {
  const { courses } = useStudy();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CourseFilter>('active');
  const keyword = normalizeSearch(query);
  const filtered = courses.filter(
    course =>
      (filter === 'all' || course.status === filter) &&
      normalizeSearch(`${course.name} ${course.id}`).includes(keyword),
  );
  function clear() {
    setQuery('');
    setFilter('all');
  }
  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <View>
            <PageHeading
              title="Môn học"
              subtitle="Tìm môn học và theo dõi thông tin lớp học."
            />
            <Field
              label="Tìm kiếm môn học"
              placeholder="Tên hoặc mã môn học"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Button title="Xóa tìm kiếm" onPress={() => setQuery('')} />
            )}
            <FilterChips<CourseFilter>
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'active', label: 'Đang học' },
                { value: 'completed', label: 'Đã học' },
                { value: 'all', label: 'Tất cả' },
              ]}
            />
            <Text style={s.muted}>
              {filtered.length} môn học ·{' '}
              {filtered.reduce((sum, item) => sum + item.credits, 0)} tín chỉ
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            message={
              query.trim()
                ? `Không có môn phù hợp với “${query.trim()}” trong bộ lọc hiện tại.`
                : 'Chưa có môn học trong bộ lọc này.'
            }
            action="Xóa tìm kiếm và bộ lọc"
            onPress={clear}
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
