import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useStudy } from '../../contexts/StudyContext';
import {
  Avatar,
  Button,
  Field,
  InfoRow,
  PageHeading,
  Screen,
  SectionHeading,
} from '../../components/study/StudyUI';
import type { StudentChanges } from '../../types/study';
import { validateStudent } from '../../utils/studyUtils';
import { studyStyles as s } from '../../theme/studyTheme';

export default function StudentProfileScreen() {
  const { student, updateStudent } = useStudy();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<StudentChanges>({
    fullName: student.fullName,
    email: student.email,
    phone: student.phone,
  });
  const [errors, setErrors] = useState<ReturnType<typeof validateStudent>>({});
  function startEditing() {
    setDraft({
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
    });
    setErrors({});
    setEditing(true);
  }
  function change(key: keyof StudentChanges, value: string) {
    setDraft(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: undefined }));
  }
  async function save() {
    const validation = validateStudent(draft);
    setErrors(validation);
    if (Object.keys(validation).length) {
      return;
    }
    setSaving(true);
    try {
      if (await updateStudent(draft)) {
        setEditing(false);
        Alert.alert('Đã lưu', 'Thông tin cá nhân đã được cập nhật.');
      }
    } finally {
      setSaving(false);
    }
  }
  return (
    <Screen detail>
      <KeyboardAvoidingView
        style={s.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PageHeading
            detail
            title={student.fullName}
            subtitle={`MSSV ${student.id}`}
            accessory={<Avatar name={student.fullName} />}
          />
          <View style={s.card}>
            <InfoRow
              label="Lớp"
              value={student.className}
              icon="people-outline"
            />
            <View style={s.divider} />
            <InfoRow
              label="Ngành học"
              value={student.major}
              icon="school-outline"
            />
          </View>
          <SectionHeading
            title="Thông tin cá nhân"
            action={!editing ? 'Chỉnh sửa' : undefined}
            onPress={startEditing}
          />
          <View style={s.card}>
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
                <InfoRow
                  label="Họ tên"
                  value={student.fullName}
                  icon="person-outline"
                />
                <View style={s.divider} />
                <InfoRow
                  label="Email"
                  value={student.email}
                  icon="mail-outline"
                />
                <View style={s.divider} />
                <InfoRow
                  label="Số điện thoại"
                  value={student.phone}
                  icon="call-outline"
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
