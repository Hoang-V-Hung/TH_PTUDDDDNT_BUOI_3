import { StyleSheet } from 'react-native';

// Đổi màu thương hiệu tại primary; font hệ thống Android/iOS hỗ trợ tiếng Việt.
export const studyColors = {
  background: '#F5F7FB',
  surface: '#FFFFFF',
  primary: '#2158B0',
  primarySoft: '#EDF3FF',
  text: '#18243B',
  muted: '#58677F',
  border: '#E0E6EF',
  inputBorder: '#A9B6CA',
  success: '#187044',
  successSoft: '#EAF6EF',
  warning: '#8A5205',
  warningSoft: '#FFF4DF',
  danger: '#B3261E',
  white: '#FFFFFF',
};
export const studyStyles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: 20, paddingBottom: 32, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  spread: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  grow: { flex: 1, minWidth: 0 },
  title: { fontSize: 26, fontWeight: '700', color: studyColors.text },
  heading: { fontSize: 19, fontWeight: '600', color: studyColors.text },
  body: { fontSize: 15, lineHeight: 23, color: studyColors.text },
  label: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: studyColors.text,
  },
  muted: { fontSize: 13, lineHeight: 20, color: studyColors.muted },
  section: { gap: 12, marginTop: 12 },
  card: {
    backgroundColor: studyColors.surface,
    borderWidth: 1,
    borderColor: studyColors.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  pressed: { opacity: 0.65 },
  divider: { height: 1, backgroundColor: studyColors.border },
});
