import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStudy } from '../../contexts/StudyContext';
import { Avatar, Screen } from '../../components/study/StudyUI';
import type { TabScreenProps } from '../../types/navigation';
import { semesterSummary } from '../../utils/studyUtils';
import { studyColors as c, studyStyles as s } from '../../theme/studyTheme';

function ProfileMenu({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [s.card, styles.menu, pressed && s.pressed]}
    >
      <Icon name={icon} size={25} color={c.primary} />
      <View style={[s.grow, styles.copy]}>
        <Text style={s.label}>{title}</Text>
        <Text style={s.muted}>{subtitle}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color={c.muted} />
    </Pressable>
  );
}
export default function ProfileScreen({
  navigation,
}: TabScreenProps<'Profile'>) {
  const { student, results } = useStudy();
  const summary = semesterSummary(results);
  return (
    <Screen branded>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cover}>
          <View pointerEvents="none" style={styles.coverAccent} />
          <Text accessibilityRole="header" style={styles.coverTitle}>
            Cá nhân
          </Text>
        </View>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Avatar name={student.fullName} large />
          </View>
          <Text style={styles.name}>{student.fullName}</Text>
          <View style={styles.studentMeta}>
            <Text selectable style={s.muted}>
              MSSV: {student.id}
            </Text>
            <Text style={s.muted}>Lớp: {student.className}</Text>
          </View>
          <Text style={styles.major}>{student.major}</Text>
        </View>
        <View style={s.content}>
          <Text style={styles.sectionLabel}>TÀI KHOẢN SINH VIÊN</Text>
          <ProfileMenu
            icon="person-circle-outline"
            title="Thông tin cá nhân"
            subtitle="Họ tên, email và số điện thoại"
            onPress={() => navigation.navigate('StudentProfile')}
          />
          <ProfileMenu
            icon="stats-chart-outline"
            title="Kết quả học tập"
            subtitle={
              results.length
                ? `${summary.gpa.toFixed(2)} GPA · ${
                    summary.passedCredits
                  } tín chỉ đạt`
                : 'Chưa có kết quả học tập'
            }
            onPress={() => navigation.navigate('AcademicResults')}
          />
          <ProfileMenu
            icon="school-outline"
            title="Môn học của tôi"
            subtitle="Danh sách môn học theo học kỳ"
            onPress={() => navigation.navigate('Courses')}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  cover: {
    height: 120,
    backgroundColor: c.primary,
    alignItems: 'center',
    paddingTop: 18,
    overflow: 'hidden',
  },
  coverAccent: {
    position: 'absolute',
    right: -35,
    top: -100,
    width: 240,
    height: 250,
    transform: [{ rotate: '-36deg' }],
    backgroundColor: c.primaryAccent,
  },
  coverTitle: { color: c.white, fontWeight: '700', fontSize: 22 },
  identity: {
    alignItems: 'center',
    backgroundColor: c.surface,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 22,
    gap: 10,
  },
  avatar: {
    position: 'absolute',
    top: -36,
    borderWidth: 5,
    borderColor: c.surface,
    borderRadius: 40,
    backgroundColor: c.surface,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: c.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  studentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 16,
    rowGap: 5,
  },
  major: { fontSize: 13, lineHeight: 21, color: c.muted, textAlign: 'center' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: c.muted,
    letterSpacing: 1,
    marginTop: 4,
  },
  menu: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 80 },
  copy: { gap: 5 },
});
