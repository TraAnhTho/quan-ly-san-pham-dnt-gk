import { AppError } from './errors.js';
import { validateProduct } from './validation.js';

export const PRODUCT_FIELDS = ['name', 'price', 'soluong', 'image'];
export const MAX_IMAGE_LENGTH = 700000;

export function isPortableImage(image) {
  if (typeof image !== 'string' || image.length > MAX_IMAGE_LENGTH) return false;
  if (!image) return true;
  if (/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(image)) return true;
  try { return new URL(image).protocol === 'https:'; } catch { return false; }
}

// Chỉ hàm này tạo dữ liệu ghi/xuất. Không truyền id hoặc spread form vào document.
export function toProductDocument(values) {
  const errors = validateProduct(values);
  if (Object.keys(errors).length) throw new AppError(Object.values(errors)[0]);
  const image = values.image || '';
  if (!isPortableImage(image)) throw new AppError('Ảnh phải là URL HTTPS hoặc dữ liệu ảnh hợp lệ. Không lưu URI cục bộ.');
  return { name: String(values.name).trim(), price: Number(String(values.price).replace(',', '.')),
    soluong: Number(values.soluong), image };
}

export function readProductDocument(data) {
  if (Object.keys(data).length !== 4 || !PRODUCT_FIELDS.every((key) => Object.hasOwn(data, key))
    || typeof data.name !== 'string' || !data.name.trim() || data.name.length > 120
    || typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price < 0 || data.price > Number.MAX_SAFE_INTEGER
    || !Number.isSafeInteger(data.soluong) || data.soluong < 0 || !isPortableImage(data.image)) {
    throw new AppError('Có document products sai cấu trúc. Kiểm tra đúng 4 trường name, price, soluong, image và kiểu dữ liệu.');
  }
  return { name: data.name, price: data.price, soluong: data.soluong, image: data.image };
}

export function filterProducts(products, keyword, order) {
  const query = keyword.trim().toLocaleLowerCase('vi');
  const result = products.filter((product) => product.name.toLocaleLowerCase('vi').includes(query));
  if (order !== 'default') result.sort((a, b) =>
    (order === 'asc' ? a.price - b.price : b.price - a.price) || a.name.localeCompare(b.name, 'vi'));
  return result;
}

export function productsJSON(products) {
  return JSON.stringify(products.map((product) => readProductDocument(toProductDocument(product))), null, 2);
}

export const formatPrice = (price) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(price)} ₫`;
