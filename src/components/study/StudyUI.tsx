import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStudy } from '../../contexts/StudyContext';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';
import type { AssignmentStatus } from '../../utils/studyUtils';

export function Button({
  title,
  onPress,
  primary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary && styles.primaryButton,
        disabled && styles.disabled,
        pressed && s.pressed,
      ]}
    >
      <Text style={[styles.buttonText, primary && styles.white]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({
  name,
  label,
  onPress,
}: {
  name: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && s.pressed]}
    >
      <Icon name={name} size={22} color={c.primary} />
    </Pressable>
  );
}



export function Screen({
  children,
  detail = false,
}: {
  children: React.ReactNode;
  detail?: boolean;
}) {
  const {
    loading,
    storageError,
    retryStorage,
    canRestoreDefaults,
    restoreDefaults,
  } = useStudy();
  return (
    <SafeAreaView
      edges={detail ? ['left', 'right', 'bottom'] : ['top', 'left', 'right']}
      style={styles.screen}
    >
      <View style={styles.frame}>
        {storageError && (
          <View accessibilityRole="alert" style={styles.banner}>
            <Text style={[s.muted, styles.warningText]}>{storageError}</Text>
            <Button
              title="Thử lại"
              disabled={loading}
              onPress={() => {
                retryStorage();
              }}
            />
          </View>
        )}
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={c.primary} />
            <Text style={s.muted}>Đang tải dữ liệu học tập…</Text>
          </View>
        ) : (
          children
        )}
      </View>
    </SafeAreaView>
  );
}

export function DetailPage({ children }: { children: React.ReactNode }) {
  return (
    <Screen detail>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </Screen>
  );
}

export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.heading}>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {subtitle && <Text style={s.muted}>{subtitle}</Text>}
    </View>
  );
}

export function SectionHeading({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={s.spread}>
      <Text accessibilityRole="header" style={[s.heading, s.grow]}>
        {title}
      </Text>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={styles.textButton}
        >
          <Text style={styles.link}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function EmptyState({
  title,
  message,
  action,
  onPress,
}: {
  title: string;
  message: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <Icon name="file-tray-outline" size={32} color={c.muted} />
      <Text style={s.heading}>{title}</Text>
      <Text style={[s.muted, styles.center]}>{message}</Text>
      {action && onPress && <Button title={action} onPress={onPress} />}
    </View>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={s.muted}>{label}</Text>
      <Text selectable style={s.body}>
        {value}
      </Text>
    </View>
  );
}

export const assignmentLabels: Record<AssignmentStatus, string> = {
  completed: 'Đã hoàn thành',
  overdue: 'Quá hạn',
  today: 'Đến hạn hôm nay',
  pending: 'Chưa hoàn thành',
};

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  return (
    <View
      style={[
        styles.badge,
        status === 'completed' && styles.successBadge,
        status === 'overdue' && styles.warningBadge,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          status === 'completed' && styles.successText,
          status === 'overdue' && styles.warningText,
        ]}
      >
        {assignmentLabels[status]}
      </Text>
    </View>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.filters}>
      {options.map(option => (
        <Pressable
          key={option.value}
          accessibilityRole="button"
          accessibilityState={{ selected: value === option.value }}
          onPress={() => onChange(option.value)}
          style={[styles.chip, value === option.value && styles.selectedChip]}
        >
          <Text
            style={[styles.chipText, value === option.value && styles.white]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={styles.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={c.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          focused && styles.focusedInput,
          error && styles.invalidInput,
        ]}
      />
      {error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={s.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background },
  frame: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  heading: { gap: 6, marginBottom: 8 },
  button: {
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.inputBorder,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: { backgroundColor: c.primary, borderColor: c.primary },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: c.text,
    textAlign: 'center',
  },
  white: { color: c.white },
  disabled: { opacity: 0.5 },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  textButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  link: { fontSize: 13, fontWeight: '600', color: c.primary },
  empty: { padding: 24, gap: 12, alignItems: 'center' },
  center: { textAlign: 'center' },
  info: { gap: 3 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: c.background,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: c.muted,
  },
  successBadge: { backgroundColor: c.successSoft },
  successText: { color: c.success },
  warningBadge: { backgroundColor: c.warningSoft },
  warningText: { color: c.warning },
  banner: {
    margin: 12,
    padding: 12,
    gap: 8,
    borderRadius: 12,
    backgroundColor: c.warningSoft,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  selectedChip: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { fontSize: 13, fontWeight: '500', color: c.muted },
  field: { gap: 7 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: c.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 16,
    color: c.text,
    backgroundColor: c.surface,
  },
  focusedInput: { borderColor: c.primary, backgroundColor: c.primarySoft },
  invalidInput: { borderColor: c.danger },
  error: { fontSize: 13, color: c.danger, lineHeight: 20 },
  metric: { flex: 1, minWidth: 0, gap: 4 },
  metricValue: {
    fontSize: 26,
    fontWeight: '600',
    color: c.primary,
    fontVariant: ['tabular-nums'],
  },
});
