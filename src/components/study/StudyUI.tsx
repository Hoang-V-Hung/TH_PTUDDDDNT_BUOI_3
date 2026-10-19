import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
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

export function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
  return (
    <View style={[styles.avatar, large && styles.largeAvatar]}>
      <Text style={[styles.initials, large && styles.largeInitials]}>
        {initials || 'SV'}
      </Text>
    </View>
  );
}

export function SearchField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={[styles.search, focused && styles.focusedInput]}>
      <Icon name="search-outline" size={21} color={c.muted} />
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        autoCorrect={false}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.searchInput}
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xóa tìm kiếm"
          onPress={() => onChangeText('')}
          style={styles.clearSearch}
        >
          <Icon name="close-circle" size={21} color={c.muted} />
        </Pressable>
      )}
    </View>
  );
}

export function CompletionSummary({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const progress = total ? Math.round((completed / total) * 100) : 0;
  return (
    <View style={[s.card, styles.completion]}>
      <View style={s.spread}>
        <View style={s.row}>
          <View style={styles.completionIcon}>
            <Icon name="checkmark-done-outline" size={22} color={c.primary} />
          </View>
          <View>
            <Text style={s.label}>Tiến độ bài tập</Text>
            <Text style={s.muted}>
              {completed}/{total} bài đã hoàn thành
            </Text>
          </View>
        </View>
        <Text style={styles.progressValue}>{progress}%</Text>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: total || 1, now: completed }}
        accessibilityLabel="Tiến độ hoàn thành bài tập"
        style={styles.progressTrack}
      >
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%` },
            progress === 100 && styles.progressComplete,
          ]}
        />
      </View>
    </View>
  );
}

export function Screen({
  children,
  detail = false,
  header,
  branded = false,
}: {
  children: React.ReactNode;
  detail?: boolean;
  header?: React.ReactNode;
  branded?: boolean;
}) {
  const focused = useIsFocused();
  const redHeader = branded || Boolean(header);
  const { loading, storageError, retryStorage } = useStudy();
  return (
    <SafeAreaView
      edges={detail ? ['left', 'right', 'bottom'] : ['top', 'left', 'right']}
      style={[styles.screen, redHeader && styles.brandedScreen]}
    >
      {focused && (
        <StatusBar
          barStyle={redHeader || detail ? 'light-content' : 'dark-content'}
        />
      )}
      <View style={styles.frame}>
        {header}
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

export function AppHeader({
  title,
  subtitle,
  eyebrow,
  accessory,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  accessory?: React.ReactNode;
}) {
  return (
    <View style={styles.appHeader}>
      <View pointerEvents="none" style={styles.headerAccent} />
      <View style={s.spread}>
        <View style={[s.grow, styles.headingCopy]}>
          {eyebrow && <Text style={styles.headerEyebrow}>{eyebrow}</Text>}
          <Text accessibilityRole="header" style={styles.headerTitle}>
            {title}
          </Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
        {accessory}
      </View>
    </View>
  );
}

export function DetailPage({ children }: { children: React.ReactNode }) {
  return (
    <Screen detail>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Screen>
  );
}

export function PageHeading({
  title,
  subtitle,
  accessory,
  detail = false,
}: {
  title: string;
  subtitle?: string;
  accessory?: React.ReactNode;
  detail?: boolean;
}) {
  return (
    <View style={[s.spread, styles.heading]}>
      <View style={[s.grow, styles.headingCopy]}>
        <Text
          accessibilityRole="header"
          style={[s.title, detail && styles.detailTitle]}
        >
          {title}
        </Text>
        {subtitle && <Text style={s.muted}>{subtitle}</Text>}
      </View>
      {accessory}
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
          <Icon name="arrow-forward" size={15} color={c.primary} />
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
      <View style={styles.emptyIcon}>
        <Icon name="file-tray-outline" size={28} color={c.primary} />
      </View>
      <Text style={s.heading}>{title}</Text>
      <Text style={[s.muted, styles.center]}>{message}</Text>
      {action && onPress && <Button title={action} onPress={onPress} />}
    </View>
  );
}

export function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) {
  return (
    <View style={s.row}>
      {icon && (
        <View style={styles.infoIcon}>
          <Icon name={icon} size={19} color={c.muted} />
        </View>
      )}
      <View style={[styles.info, s.grow]}>
        <Text style={s.muted}>{label}</Text>
        <Text selectable style={s.body}>
          {value}
        </Text>
      </View>
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
        status === 'today' && styles.warningBadge,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          status === 'completed' && styles.successText,
          status === 'overdue' && styles.warningText,
          status === 'today' && styles.warningText,
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filters}
      keyboardShouldPersistTaps="handled"
    >
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
    </ScrollView>
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
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    backgroundColor: c.background,
  },
  brandedScreen: { backgroundColor: c.primary },
  appHeader: {
    backgroundColor: c.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerAccent: {
    position: 'absolute',
    right: -60,
    top: -95,
    width: 210,
    height: 220,
    backgroundColor: c.primaryAccent,
    transform: [{ rotate: '-36deg' }],
  },
  headerEyebrow: { color: c.onPrimaryMuted, fontSize: 12, lineHeight: 19 },
  headerTitle: {
    color: c.white,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: { color: c.onPrimaryMuted, fontSize: 12, lineHeight: 19 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  heading: { marginTop: 6, marginBottom: 18 },
  headingCopy: { gap: 5 },
  detailTitle: { fontSize: 24, lineHeight: 33, letterSpacing: -0.5 },
  button: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: { backgroundColor: c.primary, borderColor: c.primary },
  buttonText: {
    fontSize: 14,
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  textButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  link: { fontSize: 13, fontWeight: '600', color: c.primary },
  empty: {
    padding: 24,
    gap: 12,
    alignItems: 'center',
    backgroundColor: c.surface,
    borderRadius: 20,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: c.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  info: { gap: 3 },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: c.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: c.background,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
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
    gap: 6,
    paddingVertical: 14,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  selectedChip: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: c.muted },
  field: { gap: 7 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: c.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: c.text,
    backgroundColor: c.surface,
  },
  focusedInput: { borderColor: c.primary, backgroundColor: c.primarySoft },
  invalidInput: { borderColor: c.danger },
  error: { fontSize: 13, color: c.danger, lineHeight: 20 },
  metric: { flex: 1, minWidth: 0, gap: 4 },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: c.primary,
    fontVariant: ['tabular-nums'],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.primarySoft,
  },
  initials: { color: c.primary, fontSize: 15, fontWeight: '700' },
  largeAvatar: { width: 64, height: 64, borderRadius: 32 },
  largeInitials: { fontSize: 22 },
  search: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    color: c.text,
    fontSize: 14,
    paddingVertical: 12,
  },
  clearSearch: {
    width: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completion: { gap: 16 },
  completionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: c.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    color: c.primary,
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 6,
    backgroundColor: c.primarySoft,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: c.primary },
  progressComplete: { backgroundColor: c.success },
});
