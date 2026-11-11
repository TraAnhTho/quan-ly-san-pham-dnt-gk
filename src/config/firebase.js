import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Dùng truy cập process.env tĩnh để Expo đưa các biến EXPO_PUBLIC_* vào bundle.
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};
const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missing = required.filter((key) => !config[key]?.trim());
const hasConfig = required.some((key) => config[key]?.trim());
export const isDemo = process.env.EXPO_PUBLIC_DEMO_MODE === 'true' || !hasConfig;
export let firebaseError = '';
export let auth = null;
export let db = null;
export let storage = null;
export const storageEnabled = !isDemo && process.env.EXPO_PUBLIC_ENABLE_STORAGE === 'true';

if (!isDemo) {
  if (missing.length) firebaseError = 'Thiếu biến môi trường Firebase. Điền đủ API_KEY, AUTH_DOMAIN, PROJECT_ID, APP_ID trong .env rồi khởi động lại.';
  else {
    try {
      const app = getApps().length ? getApp() : initializeApp(config);
      try { auth = initializeAuth(app, { persistence: inMemoryPersistence }); }
      catch (error) {
        if (error.code !== 'auth/already-initialized') throw error;
        auth = getAuth(app);
      }
      db = getFirestore(app);
      if (storageEnabled && config.storageBucket?.trim()) storage = getStorage(app);
    } catch {
      firebaseError = 'Không khởi tạo được Firebase. Kiểm tra cấu hình .env và phiên bản firebase đã cài.';
    }
  }
}
