import Feather from '@expo/vector-icons/Feather';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import BrandMark from '../components/BrandMark';
import Field from '../components/Field';
import { firebaseError, isDemo } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { colors, ui } from '../theme';
import { errorMessage } from '../utils/errors';
import { validateLogin } from '../utils/validation';

export default function LoginScreen() {
  const wide = useWindowDimensions().width >= 900;
  const { signIn, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const submitting = useRef(false);

  async function submit() {
    if (submitting.current) return;
    const nextErrors = validateLogin(email, password, isDemo);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    submitting.current = true;
    setBusy(true);
    setMessage('');
    try { await signIn(email, password); setPassword(''); }
    catch (error) { setMessage(errorMessage(error)); }
    finally { submitting.current = false; setBusy(false); }
  }

  return <SafeAreaView style={ui.page}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={[styles.wrapper, wide && styles.wide]}>
          <View style={[styles.hero, wide && styles.heroWide]}>
            <BrandMark inverted />
            <View style={[styles.heroCopy, wide && { marginTop: 30 }]}>
              <Text style={styles.eyebrow}>MỌI THỨ CÓ MỘT CHỖ RIÊNG.</Text>
              <Text accessibilityRole="header" style={[styles.heroTitle, wide && { fontSize: 49, lineHeight: 57 }]}>{wide ? 'Gọn từng kệ.\nNhẹ từng việc.' : 'Gọn từng kệ.'}</Text>
              {wide ? <Text style={styles.heroDescription}>Một không gian nhỏ để chăm chút{'\n'}và quản lý sản phẩm của bạn.</Text> : null}
            </View>
            {wide ? <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.art}>
              <View style={styles.orbit} />
              <View style={[styles.parcel, styles.parcelBack]}><Feather name="box" size={52} color="#D5E0C9" /></View>
              <View style={[styles.parcel, styles.parcelFront]}><Feather name="package" size={66} color={colors.dark} />
                <View style={styles.parcelLabel}><View style={styles.bar} /><View style={[styles.bar, { width: 30 }]} /></View>
              </View>
              <View style={styles.shelf} />
              <View style={styles.sticker}><Feather name="check" size={19} color={colors.dark} /><Text style={styles.stickerText}>ĐÂU VÀO ĐẤY.</Text></View>
            </View> : null}
            {wide ? <Text style={styles.heroFooter}>MỘT DỰ ÁN NHỎ · LẬP TRÌNH ĐA NỀN TẢNG · VKU</Text> : null}
          </View>
          <View style={[styles.formPanel, wide && { flex: 1 }]}>
          <View style={styles.badge}><Text style={styles.badgeText}>{isDemo ? 'CHẾ ĐỘ DEMO' : 'FIREBASE AUTHENTICATION'}</Text></View>
          <Text accessibilityRole="header" style={[ui.title, { fontSize: 32, marginTop: 16 }]}>Chào bạn trở lại.</Text>
          <Text style={[ui.subtitle, { marginTop: 8, marginBottom: 25 }]}>Mở kệ của bạn và bắt đầu quản lý sản phẩm.</Text>
          <View style={ui.card}>
            <View style={styles.formHeading}><Text style={[ui.label, { fontSize: 18, marginBottom: 0 }]}>Đăng nhập</Text>
              <Feather name="arrow-up-right" size={22} color={colors.primary} /></View>
            <Field label="Email" placeholder="ban@example.com" value={email} onChangeText={setEmail} error={errors.email}
              editable={!busy} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={254} />
            <Field label={isDemo ? 'Mật khẩu minh họa' : 'Mật khẩu'} placeholder={isDemo ? 'Ít nhất 6 ký tự, không dùng mật khẩu thật' : 'Nhập mật khẩu tài khoản'}
              value={password} onChangeText={setPassword} error={errors.password} secureTextEntry editable={!busy}
              autoCapitalize="none" autoCorrect={false} onSubmitEditing={submit} />
            {message || firebaseError || authError ? <Text accessibilityRole="alert" style={[ui.error, { marginBottom: 16 }]}>{message || firebaseError || authError}</Text> : null}
            <Button title={isDemo ? 'Đăng nhập demo' : 'Đăng nhập'} icon="arrow-right" onPress={submit} busy={busy} disabled={!!firebaseError} />
            {isDemo ? <Button title="Điền thông tin mẫu" variant="secondary" style={{ marginTop: 10 }} disabled={busy}
              onPress={() => { setEmail('demo@example.com'); setPassword('demo123'); setErrors({}); }} /> : null}
          </View>
          <View style={styles.note}><Feather name="info" size={19} color={colors.primary} />
            <Text style={[ui.helper, { flex: 1 }]}>{isDemo
              ? 'Chưa kết nối Firebase. Email hợp lệ và mật khẩu từ 6 ký tự chỉ mở phiên demo, không xác thực tài khoản và không cấp quyền admin. Không nhập mật khẩu thật.'
              : 'Dùng tài khoản đã tạo trong Firebase Authentication. Quyền truy cập sản phẩm do Security Rules quyết định. Phiên đăng nhập chỉ giữ trong bộ nhớ.'}</Text>
          </View>
          <Text style={styles.footer}>kệ. / SỔ SẢN PHẨM CỦA BẠN</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 18 },
  wrapper: { width: '100%', maxWidth: 490, alignSelf: 'center', paddingVertical: 12, gap: 30 },
  wide: { maxWidth: 1120, flexDirection: 'row', alignItems: 'center', gap: 54 },
  hero: { backgroundColor: colors.dark, borderRadius: 28, padding: 26, overflow: 'hidden' },
  heroWide: { flex: 1, minHeight: 650, padding: 36 },
  heroCopy: { marginTop: 20 },
  eyebrow: { color: colors.accent, fontSize: 9, letterSpacing: 1.8, fontWeight: '700' },
  heroTitle: { color: '#FFFFFF', fontSize: 32, lineHeight: 39, fontWeight: '800', letterSpacing: -1.5, marginTop: 14 },
  heroDescription: { color: '#C4D3C5', fontSize: 14, lineHeight: 23, marginTop: 15 },
  heroFooter: { color: '#AABDA9', fontSize: 8, letterSpacing: 1.1, marginTop: 30 },
  formPanel: { width: '100%', maxWidth: 450, alignSelf: 'center' },
  formHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9 },
  badgeText: { color: colors.accentInk, fontSize: 9, fontWeight: '800', letterSpacing: 1.3 },
  note: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, marginTop: 16, borderWidth: 1, borderColor: colors.border },
  footer: { color: colors.muted, textAlign: 'center', fontSize: 9, letterSpacing: 1.5, marginTop: 22 },
  art: { height: 220, marginTop: 22, alignItems: 'center', justifyContent: 'center' },
  orbit: { position: 'absolute', width: 215, height: 215, borderRadius: 110, borderColor: '#456250', borderWidth: 1, right: 8, top: 0 },
  parcel: { position: 'absolute', borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  parcelBack: { width: 117, height: 122, backgroundColor: '#365E49', left: 15, top: 38, transform: [{ rotate: '-12deg' }] },
  parcelFront: { width: 148, height: 146, backgroundColor: colors.accent, top: 43, transform: [{ rotate: '8deg' }] },
  parcelLabel: { position: 'absolute', bottom: 14, left: 14, gap: 4 },
  bar: { width: 21, height: 3, borderRadius: 2, backgroundColor: '#859C4B' },
  shelf: { position: 'absolute', left: 5, right: 5, bottom: 22, height: 2, backgroundColor: '#688268' },
  sticker: { position: 'absolute', bottom: 3, right: 5, flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: '#F3F4E3', borderRadius: 10, padding: 12, transform: [{ rotate: '-5deg' }] },
  stickerText: { color: colors.dark, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
});
