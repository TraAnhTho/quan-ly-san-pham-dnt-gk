import Feather from '@expo/vector-icons/Feather';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import BrandMark from '../components/BrandMark';
import Dialog from '../components/Dialog';
import Notice from '../components/Notice';
import ProductForm from '../components/ProductForm';
import ProductItem from '../components/ProductItem';
import { isDemo } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { exportProducts } from '../services/exportService';
import { productService } from '../services/productService';
import { errorMessage } from '../utils/errors';
import { filterProducts } from '../utils/products';
import { colors, ui } from '../theme';

const ORDERS = [{ value: 'default', label: 'Mặc định' }, { value: 'asc', label: 'Giá ↑' }, { value: 'desc', label: 'Giá ↓' }];
export default function ProductScreen() {
  const wide = useWindowDimensions().width >= 600;
  const { session, signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [fromCache, setFromCache] = useState(false);
  const [retry, setRetry] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState('default');
  const [form, setForm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const deleteLock = useRef(false);
  const exportLock = useRef(false);

  useEffect(() => productService.subscribe((items, metadata) => {
    setProducts(items); setLoading(false); setLoadError(''); setFromCache(!!metadata?.fromCache);
  }, (error) => {
    setProducts([]); setLoading(false); setLoadError(errorMessage(error));
  }), [retry]);

  const filtered = useMemo(() => filterProducts(products, keyword, order), [products, keyword, order]);
  const onEdit = useCallback((product) => setForm({ product }), []);
  const onDelete = useCallback((product) => { setDeleteError(''); setDeleting(product); }, []);

  function retryLoad() { setLoading(true); setLoadError(''); setRetry((value) => value + 1); }
  async function save(values) {
    if (form.product) await productService.update(form.product.id, values);
    else await productService.add(values);
    setNotice({ type: 'success', message: form.product ? 'Đã cập nhật sản phẩm.' : 'Đã thêm sản phẩm mới.' });
    setKeyword(''); setForm(null);
  }
  async function remove() {
    if (deleteLock.current) return;
    deleteLock.current = true; setDeletingBusy(true);
    try {
      await productService.remove(deleting.id);
      setDeleting(null); setNotice({ type: 'success', message: 'Đã xóa sản phẩm.' });
    } catch (error) { setDeleteError(errorMessage(error)); }
    finally { deleteLock.current = false; setDeletingBusy(false); }
  }
  async function exportJSON() {
    if (exportLock.current) return;
    exportLock.current = true; setExportBusy(true);
    try {
      const data = await productService.listForExport();
      const message = await exportProducts(data, isDemo);
      setNotice({ type: 'success', message });
    } catch (error) { setNotice({ type: 'error', message: errorMessage(error) }); }
    finally { exportLock.current = false; setExportBusy(false); }
  }
  async function logout() {
    setLogoutBusy(true);
    try { await signOut(); }
    catch (error) { setNotice({ type: 'error', message: errorMessage(error) }); }
    finally { setLogoutBusy(false); }
  }

  return <SafeAreaView style={ui.page}>
    <View style={[ui.content, { maxWidth: 1100 }]}>
      <View style={styles.topbar}>
        <BrandMark />
        <Pressable accessibilityRole="button" accessibilityLabel="Đăng xuất" onPress={logout} disabled={logoutBusy} style={styles.logout}>
          {logoutBusy ? <ActivityIndicator color={colors.primary} /> : <Feather name="log-out" size={20} color={colors.muted} />}
        </Pressable>
      </View>
      <View style={styles.hero}>
        <Text accessibilityRole="header" style={styles.heroTitle}>Quản lý sản phẩm</Text>
        <Text style={styles.heroSubtitle}>Mỗi sản phẩm, một chỗ gọn gàng.</Text>
      </View>
      <View style={styles.mode}><View style={styles.dot} />
        <Text style={styles.modeText}>{isDemo ? 'Chế độ demo · Dữ liệu trong bộ nhớ, mất khi tải lại' : fromCache ? 'Firebase · Dữ liệu tạm trên thiết bị, đang chờ server' : 'Firebase · Danh sách cập nhật trực tiếp'}</Text>
      </View>
      <View style={styles.search}><Feather name="search" size={16} color={colors.muted} />
        <TextInput accessibilityLabel="Tìm sản phẩm theo tên" placeholder="Tìm sản phẩm theo tên…" placeholderTextColor={colors.muted}
          style={styles.searchInput} value={keyword} onChangeText={setKeyword} autoCapitalize="none" autoCorrect={false} />
        {keyword ? <Pressable accessibilityRole="button" accessibilityLabel="Xóa từ khóa" onPress={() => setKeyword('')} hitSlop={12}>
          <Feather name="x" size={19} color={colors.muted} /></Pressable> : null}
      </View>
      <View style={styles.listHeading}>
        <View style={ui.row}><Text style={styles.count}>Trên kệ</Text>
          <View style={styles.countBadge}><Text style={styles.countNumber}>{filtered.length}{keyword ? `/${products.length}` : ''}</Text></View></View>
        <View style={[ui.row, { gap: 4 }]}>{ORDERS.map((item) => <Pressable key={item.value} accessibilityRole="button"
          accessibilityLabel={`Sắp xếp ${item.label}`} accessibilityState={{ selected: order === item.value }} onPress={() => setOrder(item.value)}
          style={[styles.order, order === item.value && { backgroundColor: colors.dark }]}>
          <Text style={{ color: order === item.value ? '#FFFFFF' : colors.muted, fontSize: 12, fontWeight: '700' }}>{item.label}</Text>
        </Pressable>)}</View>
      </View>
      <Notice notice={notice} onDismiss={() => setNotice(null)} />
      {loadError ? <Notice notice={{ type: 'error', message: loadError }} /> : null}
      {loading ? <View style={styles.empty}><ActivityIndicator size="large" color={colors.primary} /><Text style={ui.subtitle}>Đang tải sản phẩm…</Text></View>
        : <FlatList data={filtered} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
          renderItem={({ item }) => <ProductItem product={item} onEdit={onEdit} onDelete={onDelete} />}
          ListEmptyComponent={<View style={styles.empty}>
            <View style={styles.emptyIcon}><Feather name={keyword ? 'search' : 'package'} size={35} color={colors.primary} /></View>
            <Text style={styles.emptyTitle}>{loadError ? 'Chưa tải được dữ liệu' : keyword ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm'}</Text>
            <Text style={[ui.subtitle, { textAlign: 'center' }]}>{loadError ? 'Kiểm tra kết nối hoặc quyền truy cập.' : keyword ? 'Thử từ khóa khác hoặc xóa tìm kiếm.' : 'Thêm sản phẩm đầu tiên để bắt đầu.'}</Text>
            {loadError ? <Button title="Thử tải lại" variant="secondary" onPress={retryLoad} /> : keyword
              ? <Button title="Xóa từ khóa" variant="secondary" onPress={() => setKeyword('')} /> : null}
          </View>} />}
      <View style={[styles.bottom, wide && styles.bottomWide]}>
        <Text numberOfLines={1} style={[styles.session, wide && { flex: 1 }]}>{session.email} · {isDemo ? 'Phiên demo' : 'Quyền truy cập do Security Rules quyết định'}</Text>
        <View style={[ui.row, { gap: 8 }]}>
          <Button compact title="Xuất JSON" icon="download" variant="secondary" onPress={exportJSON} busy={exportBusy} style={wide ? undefined : { flex: 1 }} />
          <Button compact title="Thêm sản phẩm" icon="plus" onPress={() => setForm({ product: null })} style={wide ? undefined : { flex: 1.3 }} />
        </View>
      </View>
    </View>
    {form ? <ProductForm product={form.product} onSave={save} onClose={() => setForm(null)} /> : null}
    {deleting ? <Dialog title="Xóa sản phẩm?" subtitle={`Bạn muốn xóa “${deleting.name}”? Thao tác này không thể hoàn tác.`}
      onClose={deletingBusy ? () => {} : () => setDeleting(null)}>
      {deleteError ? <Text accessibilityRole="alert" style={[ui.error, { marginBottom: 16 }]}>{deleteError}</Text> : null}
      <View style={ui.row}>
        <Button title="Giữ lại" variant="secondary" disabled={deletingBusy} style={{ flex: 1 }} onPress={() => setDeleting(null)} />
        <Button title="Xác nhận xóa" icon="trash-2" variant="danger" busy={deletingBusy} style={{ flex: 1 }} onPress={remove} />
      </View>
    </Dialog> : null}
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  logout: { width: 38, height: Platform.OS === 'web' ? 36 : 44, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  hero: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
    gap: 8, backgroundColor: colors.dark, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  heroTitle: { color: '#FFFFFF', fontSize: 22, lineHeight: 29, letterSpacing: -0.5, fontWeight: '800' },
  heroSubtitle: { color: '#C4D3C5', fontSize: 12, lineHeight: 19 },
  mode: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 3, paddingVertical: 7 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  modeText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 16 },
  search: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 11, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: 10 },
  searchInput: { flex: 1, minWidth: 0, minHeight: Platform.OS === 'web' ? 34 : 44, paddingVertical: 7, color: colors.ink, fontSize: 13 },
  listHeading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 5, marginVertical: 7 },
  count: { color: colors.ink, fontWeight: '800', fontSize: 14 },
  countBadge: { backgroundColor: colors.accent, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  countNumber: { color: colors.accentInk, fontWeight: '800', fontSize: 11 },
  order: { minHeight: Platform.OS === 'web' ? 30 : 44, paddingHorizontal: 9, justifyContent: 'center', borderRadius: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 26, gap: 14 },
  emptyIcon: { padding: 23, borderRadius: 24, backgroundColor: colors.primaryLight },
  emptyTitle: { color: colors.ink, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  bottom: { borderTopWidth: 1, borderColor: colors.border, paddingVertical: 6, gap: 6 },
  bottomWide: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  session: { color: colors.muted, fontSize: 10 },
});
