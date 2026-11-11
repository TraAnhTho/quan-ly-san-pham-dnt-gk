import { StyleSheet } from 'react-native';
export const colors = {
  background: '#F6F5EF', surface: '#FFFFFF', ink: '#233B32', muted: '#778178',
  primary: '#244C3D', primaryLight: '#EAF0E4', border: '#E1E5D9',
  accent: '#D9EF83', accentInk: '#30471B', dark: '#183C30', sand: '#EEECE1',
  red: '#BF4053', redLight: '#FFF0F2', amber: '#8E631B', amberLight: '#FFF6E4',
};
export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 18 },
  title: { fontSize: 29, fontWeight: '800', color: colors.ink, letterSpacing: -0.7 },
  subtitle: { fontSize: 14, color: colors.muted, lineHeight: 22 },
  helper: { fontSize: 12, color: colors.muted, lineHeight: 19 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { color: colors.ink, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { minHeight: 50, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.ink },
  error: { color: colors.red, fontSize: 13, lineHeight: 20, marginTop: 6 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: 24 },
});
