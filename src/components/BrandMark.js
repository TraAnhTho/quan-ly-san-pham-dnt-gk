import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function BrandMark({ inverted = false }) {
  return <View style={styles.row}>
    <View style={[styles.symbol, inverted && { backgroundColor: colors.accent }]}>
      <Feather name="layers" size={23} color={inverted ? colors.dark : colors.accent} />
    </View>
    <View>
      <Text style={[styles.name, inverted && { color: '#FFFFFF' }]}>kệ<Text style={{ color: inverted ? colors.accent : colors.primary }}>.</Text></Text>
      <Text style={[styles.tagline, inverted && { color: '#BFCFBF' }]}>SỔ SẢN PHẨM / VKU</Text>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  symbol: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 29, lineHeight: 32, fontWeight: '900', letterSpacing: -1.5, color: colors.ink },
  tagline: { color: colors.muted, fontSize: 8, letterSpacing: 1.6, fontWeight: '700', marginTop: 3 },
});
