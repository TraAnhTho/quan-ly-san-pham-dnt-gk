import { isDemo } from '../config/firebase';
import { firestoreProductService } from './firestoreProductService';
import { mockProductService } from './mockProductService';

// Không tự chuyển sang mock khi Firebase trả lỗi đăng nhập/quyền/kết nối.
export const productService = isDemo ? mockProductService : firestoreProductService;
