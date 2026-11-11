import { productsJSON } from '../utils/products';

export async function exportProducts(products, demo) {
  const blob = new Blob([productsJSON(products)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const filename = demo ? 'products-demo.json' : 'products-firestore.json';
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return `Đã yêu cầu tải ${filename}. Kiểm tra thư mục Downloads của trình duyệt.`;
}
