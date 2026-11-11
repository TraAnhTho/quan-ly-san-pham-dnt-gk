# File dữ liệu nộp bài

- `products-demo.json` là dữ liệu mẫu chuẩn bị từ source, **không phải bản xuất Firestore thật**.
- Khi đã kết nối Firebase, đăng nhập bằng tài khoản được cấp quyền rồi bấm **Xuất JSON**. Chép `products-firestore.json` từ Downloads vào thư mục này để nộp bài.
- File xuất là một mảng JSON; mỗi phần tử chỉ có `name`, `price`, `soluong`, `image`. Hai trường số phải là number, không phải chuỗi.
- Không xuất id, timestamp, tài khoản Authentication, mật khẩu hoặc cấu hình Firebase.
- Trên Android, nút xuất mở bảng chia sẻ để bạn chọn nơi lưu. Trên web, nút xuất tải file xuống trình duyệt.
- Đây là định dạng dữ liệu phục vụ bài thi, không phải định dạng backup/restore chính thức của Firestore. Firebase Console không có nút nhập trực tiếp mảng JSON này; có thể nhập sản phẩm qua form ứng dụng hoặc thủ công trong Console.
