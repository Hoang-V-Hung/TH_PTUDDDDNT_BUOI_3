import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStudy } from '../../contexts/StudyContext';
import { RESULT_SEMESTER } from '../../data/studyData';
import type { TabScreenProps } from '../../types/navigation';
import type { StudentChanges } from '../../types/study';
import {
  findCourse,
  gradeAverage,
  gradeScale,
  semesterSummary,
  validateStudent,
} from '../../utils/studyUtils';
import {
  Button,
  EmptyState,
  Field,
  InfoRow,
  Metric,
  PageHeading,
  Screen,
  SectionHeading,
} from '../../components/study/StudyUI';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';

export default function ProfileScreen({
  navigation,
}: TabScreenProps<'Profile'>) {
  const { student, results, updateStudent, restoreDefaults } = useStudy();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<StudentChanges>({
    fullName: student.fullName,
    email: student.email,
    phone: student.phone,
  });
  const [errors, setErrors] = useState<ReturnType<typeof validateStudent>>({});
  const summary = semesterSummary(results);
  function startEditing() {
    setDraft({
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
    });
    setErrors({});
    setEditing(true);
  }
  async function save() {
    const validation = validateStudent(draft);
    setErrors(validation);
    if (Object.keys(validation).length) {
      return;
    }
    setSaving(true);
    try {
      const saved = await updateStudent(draft);
      if (saved) {
        setEditing(false);
        Alert.alert('Đã lưu', 'Thông tin cá nhân đã được cập nhật.');
      }
    } finally {
      setSaving(false);
    }
  }
  function change(key: keyof StudentChanges, value: string) {
    setDraft(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: undefined }));
  }
  return (
    <Screen>
      <KeyboardAvoidingView
        style={s.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
          ListHeaderComponent={
            <View style={s.section}>
              <PageHeading
                title="Cá nhân"
                subtitle="Thông tin sinh viên và kết quả học tập."
              />
              <View style={s.card}>
                <Text style={s.heading}>{student.fullName}</Text>
                <InfoRow label="Mã sinh viên" value={student.id} />
                <InfoRow label="Lớp" value={student.className} />
                <InfoRow label="Ngành học" value={student.major} />
                {editing ? (
                  <>
                    <Field
                      label="Họ tên"
                      value={draft.fullName}
                      onChangeText={value => change('fullName', value)}
                      error={errors.fullName}
                      maxLength={80}
                      autoCapitalize="words"
                      editable={!saving}
                    />
                    <Field
                      label="Email"
                      value={draft.email}
                      onChangeText={value => change('email', value)}
                      error={errors.email}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoCorrect={false}
                      editable={!saving}
                    />
                    <Field
                      label="Số điện thoại"
                      value={draft.phone}
                      onChangeText={value => change('phone', value)}
                      error={errors.phone}
                      keyboardType="phone-pad"
                      editable={!saving}
                    />
                    <Button
                      primary
                      title={saving ? 'Đang lưu…' : 'Lưu thay đổi'}
                      disabled={saving}
                      onPress={() => {
                        save();
                      }}
                    />
                    <Button
                      title="Hủy chỉnh sửa"
                      disabled={saving}
                      onPress={() => setEditing(false)}
                    />
                  </>
                ) : (
                  <>
                    <InfoRow label="Email" value={student.email} />
                    <InfoRow label="Số điện thoại" value={student.phone} />
                    <Button
                      title="Chỉnh sửa thông tin"
                      onPress={startEditing}
                    />
                  </>
                )}
              </View>
              <SectionHeading title="Kết quả học tập" />
              <Text style={s.muted}>{RESULT_SEMESTER}</Text>
              <View style={s.card}>
                <View style={s.row}>
                  <Metric
                    value={summary.gpa.toFixed(2)}
                    label="GPA học kỳ / 4"
                  />
                  <Metric
                    value={String(summary.passedCredits)}
                    label="Tín chỉ đạt"
                  />
                </View>
              </View>
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
                accessibilityLabel={`Kết quả ${course?.name ?? item.courseId
                  }, ${average.toFixed(2)} điểm`}
                onPress={() =>
                  navigation.navigate('GradeDetail', { resultId: item.id })
                }
                style={({ pressed }) => [s.card, pressed && s.pressed]}
              >
                <View style={s.spread}>
                  <View style={s.grow}>
                    <Text style={s.label}>{course?.name ?? item.courseId}</Text>
                    <Text style={s.muted}>
                      {item.courseId} · {course?.credits ?? 0} tín chỉ
                    </Text>
                  </View>
                  <Text style={s.heading}>
                    {average.toFixed(2)} · {gradeScale(average).letter}
                  </Text>
                  <Icon name="chevron-forward" size={18} color={c.muted} />
                </View>
              </Pressable>
            );
          }}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}
