import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, firebaseError, isDemo } from '../config/firebase';
import { AppError } from '../utils/errors';
import { validateLogin } from '../utils/validation';

export const authService = {
  subscribe(onChange, onError) {
    if (isDemo || !auth || firebaseError) { onChange(null); return () => {}; }
    return onAuthStateChanged(auth, onChange, onError);
  },
  async signIn(email, password) {
    const errors = validateLogin(email, password, isDemo);
    if (Object.keys(errors).length) throw new AppError(Object.values(errors)[0]);
    if (isDemo) {
      console.log('[Chế độ demo] Đã mở phiên minh họa; không xác thực Firebase.');
      return { email: email.trim().toLowerCase(), demo: true };
    }
    if (!auth || firebaseError) throw new AppError(firebaseError || 'Chưa khởi tạo Firebase Authentication.');
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    // Chỉ báo thành công sau khi Firebase Auth trả kết quả; không log user/credential.
    console.log('[Firebase Authentication] Đăng nhập thành công.');
    return credential.user;
  },
  async signOut() { if (!isDemo && auth) await signOut(auth); },
};
