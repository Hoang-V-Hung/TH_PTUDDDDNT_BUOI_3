import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';
import { IconButton } from './StudyUI';

export function SemesterPicker({
  value,
  options,
  onChange,
  summary,
}: {
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
  summary: string;
}) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const choices = [
    { value: null, label: 'Tất cả học kỳ' },
    ...options.map(item => ({ value: item, label: item })),
  ];
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Chọn học kỳ: ${value ?? 'Tất cả học kỳ'}`}
        onPress={() => {
          Keyboard.dismiss();
          setOpen(true);
        }}
        style={({ pressed }) => [s.card, s.spread, pressed && s.pressed]}
      >
        <View style={[s.grow, styles.copy]}>
          <Text style={s.muted}>Kỳ học</Text>
          <Text style={s.label}>{value ?? 'Tất cả học kỳ'}</Text>
          <Text style={s.muted}>{summary}</Text>
        </View>
        <Icon name="chevron-down" size={20} color={c.muted} />
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng chọn học kỳ"
            onPress={() => setOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View
            accessibilityViewIsModal
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            <View style={s.spread}>
              <Text accessibilityRole="header" style={s.heading}>
                Chọn học kỳ
              </Text>
              <IconButton
                name="close"
                label="Đóng chọn học kỳ"
                onPress={() => setOpen(false)}
              />
            </View>
            <FlatList
              data={choices}
              keyExtractor={item => item.value ?? 'all'}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: item.value === value }}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={[
                    styles.option,
                    item.value === value && styles.selected,
                  ]}
                >
                  <Text
                    style={[
                      s.body,
                      s.grow,
                      item.value === value && styles.selectedText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Icon name="checkmark" size={21} color={c.primary} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  copy: { gap: 4 },
  overlay: {
    flex: 1,
    backgroundColor: '#15182266',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: c.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
    maxHeight: '75%',
  },
  option: {
    minHeight: 56,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selected: { backgroundColor: c.primarySoft },
  selectedText: { color: c.primary, fontWeight: '600' },
});
