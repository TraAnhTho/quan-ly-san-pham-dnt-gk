import Feather from '@expo/vector-icons/Feather';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../theme';
export default function Notice({ notice, onDismiss = undefined }) {
  if (!notice) return null;
  const error = notice.type === 'error';
  const color = error ? colors.red : colors.primary;
  return <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ flexDirection: 'row', gap: 10,
    alignItems: 'center', padding: 13, marginBottom: 12, borderRadius: 12, backgroundColor: error ? colors.redLight : colors.primaryLight }}>
    <Feather name={error ? 'alert-circle' : 'check-circle'} size={19} color={color} />
    <Text style={{ flex: 1, color, fontSize: 13, lineHeight: 20 }}>{notice.message}</Text>
    {onDismiss ? <Pressable accessibilityRole="button" accessibilityLabel="Đóng thông báo" onPress={onDismiss} hitSlop={12}>
      <Feather name="x" size={18} color={color} />
    </Pressable> : null}
  </View>;
}
