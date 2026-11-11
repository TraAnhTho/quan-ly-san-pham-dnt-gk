# BÁO CÁO GIỮA KỲ — QUẢN LÝ SẢN PHẨM

- Họ và tên: [Tự điền]
- Mã sinh viên: [Tự điền]
- Lớp: [Tự điền]
- Lớp học phần: [Tự điền]
- Môn học: Lập trình đa nền tảng — VKU
- Ngày thực hiện: [Ghi ngày thực tế]
- Link GitHub: [Bổ sung sau khi push]
- Link video demo: [Bổ sung sau khi upload]

## Cách sử dụng bản hướng dẫn

Đây là khung báo cáo bám theo source `quan-ly-san-pham`, chưa phải báo cáo xác nhận đã chạy thành công. Theo yêu cầu của người làm bài, Codex chỉ viết source/tài liệu, không tiếp tục chạy lệnh cài đặt, kiểm tra hoặc mở ứng dụng. Người làm bài đã cấu hình Firebase và gửi ảnh ứng dụng đọc sản phẩm từ Firestore. Các kết quả CRUD/ảnh cần tự kiểm thử và cập nhật vào nhật ký; Codex chưa tự chạy kiểm thử Firebase. Một lệnh cài đã được bắt đầu rồi dừng khi người làm bài yêu cầu tự chạy; không dùng lần chạy dở này làm bằng chứng cài xong.

Ở từng bước, tự thực hiện, ghi kết quả quan sát và chèn ảnh thật. **Kết quả mong đợi không phải kết quả đã kiểm thử.** Không dùng kết quả/ảnh của ứng dụng quản lý người dùng trước đây cho ứng dụng sản phẩm này.

Chụp ảnh bằng **Windows + Shift + S** → chọn vùng cần chụp → mở Snipping Tool hoặc dán vào Paint → Save as PNG vào `bao-cao/screenshots`. Không dựng ảnh giả, không thêm chữ “thành công” lên ảnh khi chưa có kết quả. Ảnh gốc đề bài và ảnh tạo project đã có do người làm bài cung cấp có thể dùng làm tư liệu nếu đúng project; ghi rõ nguồn và thời điểm thực tế.

Không chụp mật khẩu đang hiện, Auth token, private key/service-account key hoặc trang chứa thông tin đăng nhập. Che/cắt URL ảnh có download token. Không quay toàn bộ file `.env` có giá trị thật; dùng `.env.example` để minh họa tên biến.

## 1. Giới thiệu đề tài

Ứng dụng quản lý sản phẩm dành cho bài thi giữa kỳ. Người được cấp quyền có thể thêm, xem, sửa, xóa sản phẩm; chọn ảnh, tìm tên, sắp xếp giá và xuất dữ liệu JSON. Ưu tiên giao diện web, đồng thời chuẩn bị chạy Android bằng Expo Go. Khi chưa có Firebase, giao diện dùng dữ liệu trong bộ nhớ với nhãn **Chế độ demo**.

Collection Firestore là `products`; mỗi document chỉ chứa:

```json
{
  "name": "Bàn phím không dây",
  "price": 350000,
  "soluong": 12,
  "image": ""
}
```

`name` và `image` là string; `price` là number không âm; `soluong` là số nguyên không âm. Document ID do Firestore cấp dùng cho sửa/xóa, không lưu thành trường thứ năm. Mật khẩu do Firebase Authentication quản lý, không có trong products hoặc JSON xuất.

## 2. Công nghệ sử dụng

- React Native và Expo SDK 58, React, JavaScript `.js`.
- Expo Router: điều hướng và bảo vệ màn hình theo phiên đăng nhập phía client.
- Firebase JS SDK: Cloud Firestore, Email/Password Authentication; Storage tùy chọn.
- `expo-image-picker`: chọn ảnh; `expo-file-system` và `expo-sharing`: đọc ảnh/xuất file trên Android.
- React Native Web và React DOM: chạy trên trình duyệt.
- React hooks `useState`, `useEffect`, `useMemo`, `useRef`, `useCallback`; FlatList hiển thị danh sách.
- ESLint và `tsc` qua `jsconfig.json`: kiểm tra JavaScript, không viết ứng dụng bằng TypeScript.
- Không sử dụng Flutter, Redux hoặc backend Node.js. Node.js/npm chỉ dùng làm công cụ phát triển.

## 3. Các bước thực hiện và vị trí chèn hình

### Bước 1 — Tạo dự án Expo (bước đã thực hiện trước khi lập trình)

- **Lệnh/thao tác:** lệnh tạo ban đầu là `npx create-expo-app@latest quan-ly-san-pham --template blank`. Không chạy lại vì project đã tồn tại. Dùng ảnh thật lúc tạo project nếu còn; nếu không còn, ghi rõ không có ảnh bước tạo, không chạy lại để dựng lịch sử.
- **Mục đích:** khởi tạo project React Native bằng Expo template blank.
- **Kết quả mong đợi:** có thư mục quan-ly-san-pham, App.js, package.json, assets và index.js.
- **Ảnh cần chèn:** `screenshots/hinh-01-tao-project.png`.

> [Chèn ảnh thật tại đây] **Hình 1. Tạo dự án Expo.**

### Bước 2 — Mở và quan sát cấu trúc source

- **Lệnh/thao tác:** mở đúng thư mục bằng VS Code, mở rộng `src/app`, `screens`, `components`, `services`, `config`, `utils`, `bao-cao`. Trong terminal chạy `cd C:\Users\Lenovo\quan-ly-san-pham`.
- **Mục đích:** xác nhận đang làm trong project sản phẩm và tách giao diện khỏi dịch vụ dữ liệu.
- **Kết quả mong đợi:** nhìn thấy cấu trúc source đúng với README. `index.js` nhập `expo-router/entry`; `src/app/_layout.js` là layout chính.
- **Ảnh cần chèn:** `screenshots/hinh-02-cau-truc-source.png`.

> [Chèn ảnh thật tại đây] **Hình 2. Cấu trúc source code.**

### Bước 3 — Cài đặt thư viện (tự chạy và chụp)

**Lệnh/thao tác:** chạy từng lệnh, đợi xong rồi chụp terminal:

```powershell
npx expo install expo-router @expo/metro-runtime expo-image-picker react-native-safe-area-context react-native-screens expo-linking expo-constants react-dom react-native-web @expo/vector-icons expo-font firebase expo-file-system expo-sharing
```

```powershell
npx expo install --dev eslint eslint-config-expo typescript @types/react
```

- **Mục đích:** dùng Expo để chọn phiên bản tương thích SDK, bổ sung web, ảnh, Firebase và công cụ kiểm tra.
- **Kết quả mong đợi:** lệnh kết thúc không lỗi; dependencies và package-lock.json được cập nhật. Nếu có cảnh báo, ghi đúng cảnh báo và cách xử lý, không tự dùng `npm audit fix --force` để nâng phiên bản tùy tiện.
- **Ảnh cần chèn:** `screenshots/hinh-03a-cai-thu-vien.png` và `hinh-03b-cai-cong-cu.png`.

> [Chèn hai ảnh thật tại đây] **Hình 3. Cài đặt thư viện.**

### Bước 4 — Tạo Firebase Project và đăng ký Web app

- **Lệnh/thao tác:** vào Firebase Console → Add/Create project → hoàn tất tạo project → Project settings → Add app → biểu tượng Web. Không tự bịa apiKey/projectId.
- **Mục đích:** có tài nguyên Firebase thật và Web SDK config dùng chung cho web/Expo Go.
- **Kết quả mong đợi:** có project thật và ứng dụng Web đã đăng ký. Chỉ chụp trang tổng quan, không chụp thông tin nhạy cảm.
- **Ảnh cần chèn:** `screenshots/hinh-04-firebase-project.png`.

> [Chèn ảnh thật sau khi tự tạo Firebase] **Hình 4. Tạo Firebase Project.**

### Bước 5 — Tạo Firestore Database

- **Lệnh/thao tác:** Build → Firestore Database → Create database `(default)` → chọn region phù hợp → tạo database. Nếu tạo document bằng Console, collection phải tên `products`, chọn Auto-ID và chỉ nhập đúng bốn trường; price/soluong chọn kiểu number. Có thể để app tạo collection ở lần thêm đầu tiên.
- **Mục đích:** lưu dữ liệu sản phẩm và theo dõi document theo thời gian thực.
- **Kết quả mong đợi:** Firestore sẵn sàng; sau khi thêm sản phẩm, document có đúng name, price, soluong, image. Không tạo password hay id trong dữ liệu.
- **Ảnh cần chèn:** `screenshots/hinh-05-firestore.png`, nên chụp sau bước thêm Firebase thật để thấy kiểu dữ liệu.

> [Chèn ảnh Console thật tại đây] **Hình 5. Cơ sở dữ liệu Firestore.**

### Bước 6 — Bật Authentication và tạo tài khoản

- **Lệnh/thao tác:** Authentication → Sign-in method → bật Email/Password. Users → Add user, tự đặt tài khoản/mật khẩu thử nghiệm. Không đưa mật khẩu vào báo cáo. Lấy UID của tài khoản để dùng cho Rules. Kiểm tra Authorized domains cho domain web của ứng dụng nếu Firebase yêu cầu.
- **Mục đích:** đăng nhập bằng tài khoản thật do Firebase quản lý, tách khỏi document sản phẩm.
- **Kết quả mong đợi:** tài khoản xuất hiện trong Authentication; đây chưa phải bằng chứng đã có quyền quản lý products.
- **Ảnh cần chèn:** `screenshots/hinh-06-auth-provider.png`; chỉ chụp provider bật, không chụp mật khẩu.

> [Chèn ảnh thật tại đây] **Hình 6. Bật đăng nhập Email/Password.**

### Bước 7 — Kết nối Firebase bằng biến môi trường

- **Lệnh/thao tác:** sao chép `.env.example` thành `.env`; tự điền Web config thật cho API_KEY, AUTH_DOMAIN, PROJECT_ID, APP_ID, sender/bucket nếu có. Đặt `EXPO_PUBLIC_DEMO_MODE=false`. Không lưu file này lên Git. Khởi động lại Expo sau khi đổi env.
- **Mục đích:** tách cấu hình khỏi source, không bịa khóa hoặc hardcode thông tin đăng nhập.
- **Kết quả mong đợi:** đủ bốn biến bắt buộc thì màn hình đăng nhập hiển thị Firebase Authentication. Chưa có cấu hình thì hiện Chế độ demo. Thiếu một phần cấu hình thì hiện lỗi, không âm thầm dùng mock.
- **Ảnh cần chèn:** `screenshots/hinh-07-env-example.png`, chỉ chụp `.env.example` trống và tên file cấu hình.

> [Chèn ảnh file mẫu, không chụp giá trị thật] **Hình 7. Cấu hình Firebase bằng biến môi trường.**

### Bước 8 — Cấp quyền và giới hạn bốn trường bằng Security Rules

- **Lệnh/thao tác:** mở `firestore.rules`, thay `request.auth.uid in []` thành `request.auth.uid in ['UID_TAI_KHOAN_DUOC_PHEP']`; dán Rules vào Console → Firestore → Rules → Publish. Chỉ điền UID tài khoản được phép. Mặc định danh sách rỗng từ chối mọi tài khoản.
- **Mục đích:** phân quyền ở database, kiểm tra `hasAll`, `hasOnly` và kiểu dữ liệu; không coi đăng nhập bất kỳ là admin.
- **Kết quả mong đợi:** UID được cấp quyền đọc/ghi/xóa; UID khác bị từ chối. Document thêm/cập nhật có trường thứ năm hoặc sai kiểu bị Rules từ chối. Chỉ ghi đạt sau khi tự thử bằng Rules Playground hoặc tài khoản thử nghiệm trong môi trường của mình.
- **Ảnh cần chèn:** `screenshots/hinh-08-security-rules.png`, không chụp credential.

> [Chèn ảnh Rules và kết quả thử thật] **Hình 8. Security Rules bảo vệ dữ liệu sản phẩm.**

### Bước 9 — Kiểm tra mã và khả năng build web

**Lệnh/thao tác:** tự chạy lần lượt trong terminal:

```powershell
npm run lint
npm run typecheck
npm test
npx expo install --check
npx expo-doctor
npx expo export --platform web
```

- **Mục đích:** phát hiện lỗi JavaScript/import, kiểu dữ liệu, dependency và bundle web trước khi demo.
- **Kết quả mong đợi:** lint/typecheck không lỗi; 5 bài test logic đạt; dependency phù hợp; export tạo `dist`. Đây không phải kiểm thử Firebase, Storage hoặc Android thực tế. Nếu gặp lỗi, lưu nội dung lỗi trước khi sửa và chạy lại.
- **Ảnh cần chèn:** `screenshots/hinh-09a-lint-typecheck.png`, `hinh-09b-tests-doctor.png`, `hinh-09c-build-web.png`.

> [Chèn ảnh terminal sau khi tự chạy] **Hình 9. Kiểm tra source và build web.**

### Bước 10 — Khởi động web

- **Lệnh/thao tác:** chạy `npx expo start --web --port 8085`, giữ terminal mở, truy cập địa chỉ được Expo hiển thị. Nếu cổng bận, đổi cổng. Demo trước khi có config bằng cách để trống các biến Firebase hoặc bật `EXPO_PUBLIC_DEMO_MODE=true`, sau đó khởi động lại server.
- **Mục đích:** kiểm tra ứng dụng React Native chạy trên trình duyệt.
- **Kết quả mong đợi:** màn hình đăng nhập tiếng Việt hiển thị, không có lỗi bundle. Nhãn demo/Firebase phải khớp cấu hình.
- **Ảnh cần chèn:** `screenshots/hinh-10-khoi-dong-web.png`.

> [Chèn ảnh thật tại đây] **Hình 10. Khởi động ứng dụng trên web.**

### Bước 11 — Đăng nhập và đăng xuất

- **Lệnh/thao tác:** demo: bấm Điền thông tin mẫu → Đăng nhập demo. Firebase: dùng tài khoản đã tạo, thử sai mật khẩu rồi đăng nhập đúng. Bấm biểu tượng Đăng xuất để về màn hình đăng nhập. Sau đó đăng nhập lại để thực hiện CRUD.
- **Mục đích:** kiểm tra đầu vào và luồng Authentication/session. Source gọi `signInWithEmailAndPassword`, `onAuthStateChanged`, `signOut` khi dùng Firebase; không lưu mật khẩu vào products.
- **Kết quả mong đợi:** ô trống/email sai báo lỗi; Firebase sai mật khẩu không được vào; tài khoản đúng chuyển màn hình, nhưng vẫn cần Rules cấp quyền. Demo không kiểm tra tài khoản thật, chỉ mở phiên minh họa. Mở lại app cần đăng nhập do phiên chỉ lưu trong bộ nhớ.
- **Ảnh cần chèn:** `screenshots/hinh-11a-dang-nhap.png`, `hinh-11b-loi-dang-nhap.png`, `hinh-11c-dang-xuat.png`. Che mật khẩu; đặt tên thêm `-demo` nếu chụp demo.

> [Chèn ảnh thật, ghi rõ demo hay Firebase] **Hình 11. Đăng nhập và đăng xuất ứng dụng.**

### Bước 12 — Hiển thị danh sách bằng FlatList/onSnapshot

- **Lệnh/thao tác:** sau khi đăng nhập, quan sát danh sách. Đối chiếu `ProductScreen.js` và `firestoreProductService.js`. Với Firebase, có thể mở hai tab, đăng nhập tài khoản được cấp quyền ở cả hai và thay đổi dữ liệu ở một tab.
- **Mục đích:** hiển thị hình, tên, giá, số lượng và tự cập nhật qua `onSnapshot`; effect trả hàm unsubscribe khi rời màn hình.
- **Kết quả mong đợi:** tab còn lại tự cập nhật; có loading, thông báo lỗi/không có quyền, trạng thái trống. Dữ liệu cache được ghi nhãn đang chờ server. Demo dùng subscriber trong bộ nhớ, không gọi Firestore.
- **Ảnh cần chèn:** `screenshots/hinh-12-danh-sach.png` và nếu thử thật `hinh-12b-cap-nhat-truc-tiep.png`.

> [Chèn ảnh thật tại đây] **Hình 12. Danh sách sản phẩm và cập nhật dữ liệu.**

### Bước 13 — Thêm sản phẩm

- **Lệnh/thao tác:** Thêm sản phẩm → tên `Sản phẩm kiểm thử`, giá `125000`, số lượng `3`, ảnh để trống hoặc URL HTTPS hợp lệ → Thêm sản phẩm. Source chuẩn hóa dữ liệu qua `toProductDocument` rồi `addDoc(collection(db, 'products'), data)`.
- **Mục đích:** tạo document mới bằng Auto-ID, lưu hai trường số đúng kiểu.
- **Kết quả mong đợi:** thông báo thêm thành công sau khi Promise hoàn tất, form đóng, danh sách cập nhật; ở Firebase, kiểm tra document thật trong Console đúng 4 trường. Không ghi là đã thêm lên Firestore nếu đang có nhãn demo.
- **Ảnh cần chèn:** `screenshots/hinh-13a-form-them.png`, `hinh-13b-them-thanh-cong.png`, `hinh-13c-document-4-truong.png` khi kết nối thật.

> [Chèn ảnh form và kết quả thật] **Hình 13. Thêm sản phẩm.**

### Bước 14 — Kiểm tra dữ liệu đầu vào

- **Lệnh/thao tác:** thử để trống tên, giá trống, giá `abc`, giá `-1`, số lượng `1.5`, số lượng âm. Sau đó thử giá `0`, số lượng `0` và giá thập phân `12,5`. Không nhập dấu phân cách hàng nghìn.
- **Mục đích:** tránh lưu NaN, số âm, số lượng không nguyên hoặc vượt giới hạn số an toàn của JavaScript.
- **Kết quả mong đợi:** dữ liệu sai bị chặn, lỗi hiện ngay dưới ô nhập; 0 hợp lệ. Thử lưu lại sau khi sửa lỗi phải hoạt động. Lỗi Firebase/quyền hiện thông báo, không giả thành công.
- **Ảnh cần chèn:** `screenshots/hinh-14-validation.png`.

> [Chèn ảnh lỗi thật tại đây] **Hình 14. Kiểm tra dữ liệu sản phẩm.**

### Bước 15 — Sửa sản phẩm

- **Lệnh/thao tác:** bấm Sửa ở sản phẩm kiểm thử; đổi giá `150000`, số lượng `5`, tên/ảnh nếu cần → Lưu thay đổi. Source dùng `updateDoc` đúng document ID đang chọn.
- **Mục đích:** cập nhật document hiện tại, không tạo bản ghi mới hoặc lưu ID vào dữ liệu.
- **Kết quả mong đợi:** form chứa thông tin cũ; danh sách/Console cập nhật; ID document không đổi, vẫn đúng bốn trường.
- **Ảnh cần chèn:** `screenshots/hinh-15a-form-sua.png`, `hinh-15b-sua-thanh-cong.png`.

> [Chèn ảnh thật tại đây] **Hình 15. Sửa thông tin sản phẩm.**

### Bước 16 — Xóa có xác nhận

- **Lệnh/thao tác:** chỉ thử với sản phẩm kiểm thử: bấm Xóa → Giữ lại, kiểm tra sản phẩm còn; bấm Xóa lần nữa → Xác nhận xóa. Source gọi `deleteDoc` bằng document ID.
- **Mục đích:** ngăn xóa nhầm và kiểm tra cập nhật danh sách sau xóa.
- **Kết quả mong đợi:** hủy không xóa; xác nhận xóa đúng một sản phẩm; Firestore Console không còn document nếu đang dùng Firebase. Lỗi quyền phải được hiển thị.
- **Ảnh cần chèn:** `screenshots/hinh-16a-xac-nhan-xoa.png`, `hinh-16b-xoa-thanh-cong.png`.

> [Chèn ảnh thật tại đây] **Hình 16. Xóa sản phẩm có xác nhận.**

### Bước 17 — Chọn và lưu ảnh nhỏ vào Firestore, hoặc dùng URL HTTPS

- **Lệnh/thao tác:** mở form → Chọn ảnh → chọn JPEG/PNG/WebP/GIF; quan sát preview. Demo hoặc Firebase chưa có Storage: dùng ảnh không quá 500 KB, app chuyển thành data URI. Trong Firebase, chuỗi ảnh được lưu bền vững vào đúng trường image; demo chỉ lưu bộ nhớ. Có thể dùng URL HTTPS thay thế. Chọn ảnh trên web phải bắt đầu từ nút bấm; web không có màn hình cắt như Android.
- **Mục đích:** kiểm tra ImagePicker/preview/ảnh danh sách, đồng thời không lưu URI thiết bị thành URL dùng chung.
- **Kết quả mong đợi:** ảnh hiển thị ở preview và sau khi lưu; ảnh trống/lỗi về icon mặc định. Với Firebase chưa có Storage, kiểm tra image bắt đầu bằng data:image/...;base64, rồi tải lại trang/đăng nhập lại để kiểm tra ảnh vẫn có. Ảnh vượt 500 KB phải báo lỗi; URL HTTPS là phương án thay thế. Không nhận đây là upload Storage.
- **Ảnh cần chèn:** `screenshots/hinh-17a-chon-anh.png`, `hinh-17b-anh-danh-sach.png`.

> [Chèn ảnh sản phẩm thật, không chụp ảnh riêng tư] **Hình 17. Chọn và hiển thị hình ảnh sản phẩm.**

### Bước 18 — Upload Storage (tùy chọn, chỉ ghi hoàn thành khi đã thử)

- **Lệnh/thao tác:** nếu quyết định dùng Storage, tạo bucket và tự kiểm tra yêu cầu billing trong Console. Điền bucket, bật `EXPO_PUBLIC_ENABLE_STORAGE=true`; sửa UID trong `storage.rules`, Publish, khởi động lại. Chọn ảnh dưới 5 MB rồi lưu sản phẩm.
- **Mục đích:** upload bằng `uploadBytes`, lấy URL bằng `getDownloadURL`; Firestore chỉ lưu URL tại trường image.
- **Kết quả mong đợi:** file thật xuất hiện trong Storage, document chứa URL HTTPS; mở sản phẩm từ web/Android khác vẫn có ảnh. Nếu chưa tạo bucket/bật billing, ghi rõ **chưa kiểm thử upload Storage, đang lưu ảnh nhỏ trực tiếp vào Firestore hoặc dùng URL ảnh**. Không tự bật billing chỉ để hoàn thành báo cáo.
- **Ảnh cần chèn:** `screenshots/hinh-18-storage.png` nếu có. Không chụp nguyên download token trong URL.

> [Chèn ảnh thật nếu đã dùng Storage; nếu chưa, ghi rõ đang dùng dữ liệu ảnh trong Firestore hoặc URL] **Hình 18. Lưu ảnh bền vững bằng Firebase Storage.**

### Bước 19 — Tìm kiếm và xóa từ khóa

- **Lệnh/thao tác:** nhập một phần tên, thử cùng từ khóa viết hoa và thường; bấm dấu × để xóa. Tìm chuỗi không có sản phẩm.
- **Mục đích:** minh họa `.filter()` theo tên và chuyển về danh sách đầy đủ.
- **Kết quả mong đợi:** kết quả không phụ thuộc hoa/thường; xóa từ khóa khôi phục danh sách. Không có kết quả hiện trạng thái phù hợp; không xóa dữ liệu thật.
- **Ảnh cần chèn:** `screenshots/hinh-19-tim-kiem.png`.

> [Chèn ảnh thật tại đây] **Hình 19. Tìm kiếm sản phẩm theo tên.**

### Bước 20 — Sắp xếp giá

- **Lệnh/thao tác:** chọn Giá ↑ rồi Giá ↓; sau đó Mặc định. Dùng ít nhất ba sản phẩm có giá khác nhau.
- **Mục đích:** dùng `.sort()` với comparator số, hoạt động cùng bộ lọc tìm kiếm.
- **Kết quả mong đợi:** giá tăng/giảm đúng, không sắp theo chuỗi và không sửa mảng snapshot gốc. Mặc định trở lại thứ tự snapshot, không cam kết là thứ tự thời gian vì database không có createdAt.
- **Ảnh cần chèn:** `screenshots/hinh-20a-gia-tang.png`, `hinh-20b-gia-giam.png`.

> [Chèn ảnh thật tại đây] **Hình 20. Sắp xếp sản phẩm theo giá.**

### Bước 21 — Xuất dữ liệu JSON

- **Lệnh/thao tác:** bấm Xuất JSON. Web tải file vào Downloads; Android mở bảng chia sẻ, tự chọn nơi lưu. Sao chép file vào `bao-cao/database`. Mở JSON để kiểm tra bốn trường. Khi Firebase thật dùng `getDocsFromServer` để xuất toàn bộ collection, kể cả đang có bộ lọc trên giao diện.
- **Mục đích:** chuẩn bị file dữ liệu nộp theo đề thi, không xuất tài khoản hoặc mật khẩu.
- **Kết quả mong đợi:** Firebase tạo `products-firestore.json`, demo tạo `products-demo.json`. Mỗi phần tử đúng 4 trường, price/soluong là number. Bản demo sẵn trong source chỉ là mẫu; không gọi là file xuất Firestore. File này không phải định dạng backup/import chính thức của Console.
- **Ảnh cần chèn:** `screenshots/hinh-21-json.png`. Chỉ chụp các trường không chứa URL token; có thể chọn sản phẩm ảnh rỗng để chụp schema.

> [Chèn ảnh file xuất thật và ghi rõ nguồn dữ liệu] **Hình 21. Xuất dữ liệu sản phẩm ra JSON.**

### Bước 22 — Kiểm thử trên Android và bố cục điện thoại

**Lệnh/thao tác:** dừng server web bằng Ctrl+C, chọn một trong hai:

```powershell
npx expo start --go --port 8085
```

Điện thoại cùng Wi-Fi, Expo Go hỗ trợ SDK 58, quét QR. Hoặc mở máy ảo Android trước rồi chạy:

```powershell
npx expo start --android --go --port 8085
```

- **Mục đích:** kiểm tra cùng source trên Android: safe area, bàn phím/form cuộn, ảnh thư viện, CRUD và xuất JSON.
- **Kết quả mong đợi:** app mở được, form không bị bàn phím che mất thao tác; chọn/preview ảnh và danh sách đúng. Firebase/URL ảnh thực phải hiển thị trên cả web và Android. Nếu không có thiết bị/máy ảo, ghi **chưa kiểm thử Android**, không dùng ảnh web giả làm Android.
- **Ảnh cần chèn:** `screenshots/hinh-22a-android-danh-sach.png`, `hinh-22b-android-chon-anh.png`, `hinh-22c-android-form.png`. Máy ảo có thể chụp bằng Windows + Shift + S; điện thoại dùng chức năng screenshot của máy rồi chuyển ảnh vào thư mục.

> [Chèn ảnh Android thật sau khi chạy] **Hình 22. Kiểm thử ứng dụng trên Android.**

### Bước 23 — Nộp source GitHub

**Lệnh/thao tác:** tự tạo repository GitHub và kiểm tra remote trước khi đẩy. Không push .env, credentials, node_modules hoặc ảnh riêng tư. Thư mục đã có .git thì không cần git init lại. Có thể chạy:

```powershell
git status
git remote -v
git add .
git diff --cached --stat
git commit -m "Hoan thanh ung dung quan ly san pham"
git branch -M main
git remote add origin <URL_REPOSITORY_CUA_BAN>
git push -u origin main
```

Nếu origin đã tồn tại, bỏ lệnh add origin; kiểm tra URL trước khi dùng. `<URL_REPOSITORY_CUA_BAN>` là chỗ điền, không gõ nguyên dấu ngoặc. Xem kỹ staged files trước commit; có thể bỏ file nhạy cảm khỏi staging bằng `git restore --staged <ten-file>`.

- **Mục đích:** nộp source kèm README, báo cáo, ảnh thật và JSON.
- **Kết quả mong đợi:** link repo truy cập được theo yêu cầu giảng viên; .env.example vẫn trống; không có mật khẩu hoặc private key.
- **Ảnh cần chèn:** `screenshots/hinh-23-github.png`.

> [Chèn ảnh repository thật sau khi push] **Hình 23. Nộp source code trên GitHub.**

### Bước 24 — Quay video và hoàn thiện bài nộp

- **Lệnh/thao tác:** tự quay màn hình bằng công cụ sẵn có. Kịch bản: giới thiệu → nhãn demo/Firebase → đăng nhập → danh sách → thêm → validation → sửa → tìm → sắp xếp → xóa xác nhận → ảnh → JSON → Firestore đúng 4 trường → Android nếu đã thử → đăng xuất. Không quay mật khẩu, token hoặc .env thật.
- **Mục đích:** chứng minh các chức năng bằng thao tác thực tế, gắn đúng dữ liệu đang chạy.
- **Kết quả mong đợi:** video mở được bằng link nộp, khớp source và kết quả báo cáo. Nếu còn demo thì nói rõ, không nhận là Firestore thật. Điền link GitHub/video và thông tin sinh viên vào đầu báo cáo.
- **Ảnh cần chèn:** `screenshots/hinh-24-video-demo.png` nếu cần minh họa link/video.

> [Chèn ảnh video thật nếu cần] **Hình 24. Video demo ứng dụng.**

## 4. Giải thích source để trình bày với giảng viên

- `firebase.js`: đọc env tĩnh theo chuẩn Expo, khởi tạo Auth/Firestore/Storage khi đủ config. Không tạo tài khoản hoặc tự cấp vai trò.
- `AuthContext.js`: dùng effect theo dõi `onAuthStateChanged`, cập nhật session; layout bảo vệ route phía client. Quyền dữ liệu thật vẫn do Rules ở server quyết định.
- `ProductScreen.js`: state quản lý từ khóa, thứ tự, modal và thông báo; effect đăng ký/hủy subscription; FlatList chỉ hiển thị kết quả đã lọc/sắp xếp.
- `ProductForm.js`: state form, `validateProduct`, `async/await`, `try/catch`, khóa thao tác lưu để tránh bấm đúp; chọn ảnh và preview trước khi gửi service.
- `products.js`: `toProductDocument()` tạo object bốn trường; `readProductDocument()` kiểm tra document đọc; serializer JSON loại metadata. ID chỉ nằm trong mô hình giao diện.
- `firestoreProductService.js`: `addDoc`, `onSnapshot`, `updateDoc`, `deleteDoc`; bỏ snapshot pending write, chỉ báo lưu thành công khi Promise ghi hoàn tất; export đọc server.
- `mockProductService.js`: Map và subscriber trong bộ nhớ; cùng contract service, không giả danh Firestore.
- `imageService.js`: dữ liệu ảnh demo có thể di chuyển; Firebase lưu ảnh nhỏ dạng data URI trực tiếp vào trường image khi không dùng Storage; khi có Storage thì upload bytes và lấy HTTPS URL. Không đưa URI cục bộ vào document.
- `exportService.web.js`: Blob và download trên trình duyệt. `exportService.js`: Expo File API và Sharing trên Android; việc bảng chia sẻ đóng không chứng minh file đã lưu.

## 5. Nhật ký kiểm thử — tự ghi sau khi chạy

Trạng thái ban đầu của tất cả mục dưới đây là **CHƯA CHẠY**. Sau khi tự thực hiện, thay bằng Đạt/Không đạt, ghi lỗi nếu có, môi trường, ngày giờ và tên ảnh tương ứng:

- Cài đặt thư viện: [chưa chạy/đạt/lỗi + ghi chú].
- Lint: [kết quả thực tế].
- Typecheck JavaScript: [kết quả thực tế].
- 5 bài test logic: [số pass/fail thực tế].
- Expo dependency check và doctor: [kết quả thực tế].
- Export bundle web: [kết quả thực tế].
- Đăng nhập và CRUD demo trên web: [kết quả thực tế].
- Firebase Auth đúng/sai mật khẩu, đăng xuất: [kết quả thực tế].
- Firestore thêm/hiển thị trực tiếp/sửa/xóa, đúng bốn trường: [kết quả thực tế].
- Rules: tài khoản được cấp quyền/không được cấp quyền, từ chối trường thứ năm: [kết quả thực tế].
- Ảnh URL và ImagePicker preview: [web/Android, kết quả thực tế].
- Storage upload nếu có: [chưa cấu hình/chưa kiểm thử/đạt/lỗi].
- Tìm theo tên, xóa từ khóa, sắp xếp giá: [kết quả thực tế].
- Export JSON đúng bốn trường và đúng nguồn: [tên file, kết quả thực tế].
- Android Expo Go/Emulator: [thiết bị/phiên bản/kết quả; ghi chưa thử nếu chưa có].

## 6. Kết luận và phần chưa hoàn thiện

Chỉ viết kết luận sau khi cập nhật nhật ký. Tách ba nhóm: (1) source đã triển khai; (2) chức năng đã chạy và có ảnh thật; (3) phần chưa cấu hình/chưa thử. Không ghi upload Storage hoàn tất nếu lưu data URI trong Firestore hoặc chỉ dùng URL, không ghi CRUD Firebase hoàn tất nếu chỉ chạy demo. Không có ảnh Codex chụp cho ứng dụng sản phẩm theo yêu cầu tự chạy/chụp của người làm bài.

## 7. Tài liệu tham khảo

- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)
- [Dùng Firebase JS SDK trong Expo](https://docs.expo.dev/guides/using-firebase/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo ImagePicker SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/imagepicker/)
- [Expo FileSystem SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/filesystem/)
- [Firebase Auth Email/Password](https://firebase.google.com/docs/auth/web/password-auth)
- [Firestore thêm/cập nhật](https://firebase.google.com/docs/firestore/manage-data/add-data)
- [Firestore realtime listener](https://firebase.google.com/docs/firestore/query-data/listen)
- [Firestore Security Rules kiểm tra trường và kiểu](https://firebase.google.com/docs/firestore/security/rules-fields)
- [Firebase Storage upload bytes](https://firebase.google.com/docs/storage/web/upload-files)

## Ghi chú lần chỉnh giao diện “kệ.”

Source giao diện hiện tại có nhận diện kệ. với nền kem, xanh rêu và xanh chanh. Màn hình đăng nhập có hai cột ở web rộng, thu gọn trên điện thoại; danh sách hiển thị số sản phẩm cạnh nhãn “Trên kệ”. BrandMark là thành phần giao diện tự thiết kế cho bài tập, không phải logo chính thức của trường. Chức năng và cấu trúc bốn trường giữ nguyên. Chưa chạy kiểm tra hiển thị/lint/typecheck cho lần sửa này; người làm bài tự chạy và ghi kết quả, chụp lại ảnh tương ứng các bước 10–22.


### Ảnh kiểm tra đăng nhập bằng Console

Mở DevTools → Console trước khi đăng nhập. Đăng xuất rồi đăng nhập bằng tài khoản Firebase thật. Source ghi [Firebase Authentication] Đăng nhập thành công. chỉ sau khi signInWithEmailAndPassword trả kết quả. Demo ghi nhãn riêng, không được dùng làm bằng chứng Auth thật. Log không chứa mật khẩu, token, email hoặc credential. Chụp giao diện cùng dòng log làm ảnh bổ sung Hình 5.2; đóng hộp thoại lưu mật khẩu trước khi chụp. Lần bổ sung log này chưa được Codex chạy kiểm thử theo yêu cầu người làm bài tự thao tác.

