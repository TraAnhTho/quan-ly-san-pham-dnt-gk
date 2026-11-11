import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export default function Button({ title, onPress, icon = undefined, variant = 'primary', busy = false, disabled = false, compact = false, style = undefined }) {
  const color = variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? colors.red : colors.primary;
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: busy || disabled }}
    disabled={busy || disabled} onPress={onPress}
    style={({ pressed }) => [styles.base, styles[variant], compact && styles.compact, style, (pressed || busy || disabled) && { opacity: 0.6 }]}>
    {busy ? <ActivityIndicator color={color} /> : icon ? <Feather name={icon} size={compact ? 14 : 18} color={color} /> : null}
    <Text style={{ color, fontSize: compact ? 12 : 14, fontWeight: '700', textAlign: 'center' }}>{title}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  base: { minHeight: 46, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 15,
    flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' },
  primary: { backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.primary },
  secondary: { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.redLight },
  compact: { minHeight: Platform.OS === 'web' ? 32 : 44, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 9, gap: 6 },
});
