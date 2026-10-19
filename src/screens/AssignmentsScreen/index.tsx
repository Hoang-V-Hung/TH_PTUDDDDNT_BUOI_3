import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import { useStudyClock } from '../../hooks/useStudyClock';
import type { TabScreenProps } from '../../types/navigation';
import {
  assignmentStatus,
  findCourse,
  normalizeSearch,
} from '../../utils/studyUtils';
import { AssignmentCard } from '../../components/study/AssignmentCard';
import {
  EmptyState,
  SearchField,
  CompletionSummary,
  FilterChips,
  AppHeader,
  Screen,
} from '../../components/study/StudyUI';
import { studyStyles as s } from '../../theme/studyTheme';

type AssignmentFilter = 'all' | 'pending' | 'completed' | 'overdue';
export default function AssignmentsScreen({
  navigation,
}: TabScreenProps<'Assignments'>) {
  const { assignments } = useStudy();
  const now = useStudyClock();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AssignmentFilter>('all');
  const filtered = assignments
    .filter(item => {
      const matches =
        filter === 'all' ||
        (filter === 'pending' && !item.completed) ||
        (filter === 'completed' && item.completed) ||
        (filter === 'overdue' && assignmentStatus(item, now) === 'overdue');
      return (
        matches &&
        normalizeSearch(
          `${item.title} ${findCourse(item.courseId)?.name ?? ''}`,
        ).includes(normalizeSearch(query))
      );
    })
    .sort(
      (a, b) =>
        Number(a.completed) - Number(b.completed) ||
        a.dueDate.localeCompare(b.dueDate),
    );
  const completed = assignments.filter(item => item.completed).length;
  return (
    <Screen
      header={
        <AppHeader
          title="Bài tập"
          subtitle="Theo dõi hạn nộp và tiến độ hoàn thành"
        />
      }
    >
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <View>
            <View style={s.section}>
              <CompletionSummary
                completed={completed}
                total={assignments.length}
              />
              <SearchField
                label="Tìm kiếm bài tập"
                placeholder="Tên bài tập hoặc môn học"
                value={query}
                onChangeText={setQuery}
              />
            </View>
            <FilterChips<AssignmentFilter>
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'pending', label: 'Chưa xong' },
                { value: 'completed', label: 'Đã xong' },
                { value: 'overdue', label: 'Quá hạn' },
              ]}
            />
            <Text style={s.muted}>
              {filtered.length} bài tập · Sắp xếp theo hạn nộp
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập phù hợp"
            message="Thử đổi từ khóa hoặc xem tất cả trạng thái."
            action="Xóa tìm kiếm và bộ lọc"
            onPress={() => {
              setQuery('');
              setFilter('all');
            }}
          />
        }
        renderItem={({ item }) => (
          <AssignmentCard
            assignment={item}
            now={now}
            onPress={() =>
              navigation.navigate('AssignmentDetail', { assignmentId: item.id })
            }
          />
        )}
      />
    </Screen>
  );
}
