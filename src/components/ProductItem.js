import { memo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, ui } from '../theme';
import { formatPrice } from '../utils/products';
import Button from './Button';
import ProductImage from './ProductImage';

function ProductItem({ product, onEdit, onDelete }) {
  const wide = useWindowDimensions().width >= 600;
  return <View style={[styles.card, wide && styles.wide]}>
    <View style={[styles.main, wide && { flex: 1 }]}>
      <ProductImage uri={product.image} size={48} />
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.metadata}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.quantity}>Số lượng: {product.soluong}</Text>
        </View>
      </View>
    </View>
    <View style={[ui.row, styles.actions, wide && styles.actionsWide]}>
      <Button compact title="Sửa" icon="edit-2" variant="secondary" onPress={() => onEdit(product)} />
      <Button compact title="Xóa" icon="trash-2" variant="danger" onPress={() => onDelete(product)} />
    </View>
  </View>;
}
export default memo(ProductItem);
const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1,
    borderRadius: 13, padding: 10, marginBottom: 7, gap: 8 },
  wide: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  main: { flexDirection: 'row', alignItems: 'center', gap: 11, minWidth: 0 },
  details: { flex: 1, gap: 5, minWidth: 0 },
  name: { color: colors.ink, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  metadata: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 15, rowGap: 3 },
  price: { color: colors.primary, fontSize: 14, fontWeight: '800', lineHeight: 20 },
  quantity: { color: colors.muted, fontSize: 11, lineHeight: 18 },
  actions: { justifyContent: 'flex-end', gap: 6 },
  actionsWide: { flexShrink: 0 },
});
