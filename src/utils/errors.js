export class AppError extends Error {}

const messages = {
  'auth/invalid-credential': 'Email hoặc mật khẩu không đúng.',
  'auth/invalid-email': 'Email chưa đúng định dạng.',
  'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa.',
  'auth/too-many-requests': 'Có quá nhiều lần thử. Vui lòng thử lại sau.',
  'auth/network-request-failed': 'Không kết nối được Firebase. Kiểm tra mạng và thử lại.',
  'auth/operation-not-allowed': 'Chưa bật Email/Password trong Firebase Authentication.',
  'auth/invalid-api-key': 'Cấu hình Firebase chưa hợp lệ. Kiểm tra file .env.',
  'permission-denied': 'Tài khoản chưa được cấp quyền truy cập products trong Security Rules.',
  unavailable: 'Firestore chưa sẵn sàng. Kiểm tra kết nối mạng rồi thử lại.',
  'not-found': 'Sản phẩm không còn tồn tại. Vui lòng tải lại danh sách.',
  'storage/unauthorized': 'Chưa có quyền tải ảnh lên Firebase Storage.',
  'storage/quota-exceeded': 'Storage vượt hạn mức. Kiểm tra dung lượng và billing hoặc dùng URL ảnh.',
  'storage/retry-limit-exceeded': 'Tải ảnh quá thời gian chờ. Kiểm tra mạng hoặc dùng URL ảnh.',
  'storage/bucket-not-found': 'Chưa tạo bucket Storage. Bạn có thể dùng URL ảnh HTTPS.',
};

export function errorMessage(error) {
  return error instanceof AppError ? error.message
    : messages[error?.code] || 'Không thực hiện được thao tác. Kiểm tra mạng, cấu hình Firebase và thử lại.';
}
