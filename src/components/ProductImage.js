import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Image, View } from 'react-native';
import { colors } from '../theme';
export default function ProductImage({ uri = '', size = 84 }) {
  const [failed, setFailed] = useState(null);
  return <View style={{ width: size, height: size, borderRadius: Math.min(18, size / 4), overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.sand }}>
    {uri && failed !== uri ? <Image accessibilityLabel="Hình sản phẩm" source={{ uri }}
      onError={() => setFailed(uri)} style={{ width: size, height: size }} resizeMode="cover" />
      : <><View pointerEvents="none" style={{ position: 'absolute', width: size * 0.8, height: size * 0.8,
        borderWidth: 1, borderColor: '#D9DDCA', borderRadius: size / 2, bottom: -size * 0.3, right: -size * 0.2 }} />
        <Feather accessibilityLabel="Ảnh sản phẩm mặc định" name="package" size={size / 2.7} color={colors.primary} /></>}
  </View>;
}
