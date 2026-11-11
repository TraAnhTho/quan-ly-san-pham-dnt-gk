import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { isDemo, storage } from '../config/firebase';
import { AppError } from '../utils/errors';
import { isPortableImage } from '../utils/products';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
// Base64 tăng kích thước khoảng 1/3; giới hạn này giữ chuỗi dưới 700.000 ký tự
// và document dưới giới hạn 1 MiB của Firestore.
const MAX_INLINE_BYTES = 500 * 1024;
export const inlineImages = isDemo || !storage;
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function webDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new AppError('Không đọc được ảnh đã chọn.'));
    reader.readAsDataURL(file);
  });
}

export async function prepareImage(asset, imageURL) {
  if (!asset) {
    const image = imageURL.trim();
    if (!isPortableImage(image)) throw new AppError('Nhập URL ảnh HTTPS hợp lệ hoặc để trống để dùng ảnh mặc định.');
    return { image, uploadedPath: null };
  }
  const nativeFile = Platform.OS === 'web' ? null : new File(asset.uri);
  const webFile = Platform.OS === 'web' ? asset.file : null;
  const size = webFile?.size ?? nativeFile?.size ?? asset.fileSize;
  const mimeType = asset.mimeType || webFile?.type || 'image/jpeg';
  if (!TYPES.includes(mimeType)) throw new AppError('Hãy chọn ảnh JPEG, PNG, WebP hoặc GIF.');
  if (!size || size > (inlineImages ? MAX_INLINE_BYTES : MAX_UPLOAD_BYTES)) {
    throw new AppError(inlineImages ? 'Ảnh cần không quá 500 KB để lưu trực tiếp. Chọn ảnh nhỏ hơn hoặc dùng URL HTTPS.' : 'Ảnh cần không quá 5 MB.');
  }
  if (inlineImages) {
    const image = Platform.OS === 'web' ? await webDataURL(webFile) : `data:${mimeType};base64,${await nativeFile.base64()}`;
    if (!isPortableImage(image)) throw new AppError('Ảnh quá lớn hoặc chưa đúng định dạng. Hãy chọn ảnh khác.');
    // Chuỗi chứa dữ liệu ảnh thực, dùng được sau khi tải lại và trên thiết bị khác.
    // Khi chạy Firebase, productService sẽ ghi chuỗi vào đúng trường image.
    return { image, uploadedPath: null };
  }
  // Đọc bytes trên cả hai nền tảng, không lưu file://, content:// hoặc blob: vào document.
  const bytes = Platform.OS === 'web' ? new Uint8Array(await webFile.arrayBuffer()) : await nativeFile.bytes();
  const uploadedPath = `product-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${mimeType.split('/')[1]}`;
  const imageRef = ref(storage, uploadedPath);
  await uploadBytes(imageRef, bytes, { contentType: mimeType });
  try { return { image: await getDownloadURL(imageRef), uploadedPath }; }
  catch (error) { await discardUpload(uploadedPath); throw error; }
}

export async function discardUpload(path) {
  if (storage && path) {
    // Chỉ dọn ảnh vừa tải lên khi lưu thất bại; không xóa ảnh cũ có thể đang được dùng chung.
    try { await deleteObject(ref(storage, path)); } catch { /* Có thể dọn thủ công trong Storage. */ }
  }
}
