import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AppError } from '../utils/errors';
import { productsJSON } from '../utils/products';

export async function exportProducts(products, demo) {
  if (!(await Sharing.isAvailableAsync())) throw new AppError('Thiết bị chưa hỗ trợ chia sẻ file. Hãy xuất JSON trên web.');
  const file = new File(Paths.cache, `${demo ? 'products-demo' : 'products-firestore'}-${Date.now()}.json`);
  file.create();
  await file.write(productsJSON(products));
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Lưu file dữ liệu sản phẩm' });
  return 'Đã đóng bảng chia sẻ. File chỉ được lưu ra ngoài ứng dụng nếu bạn chọn nơi nhận hoặc lưu file.';
}
