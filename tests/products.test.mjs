import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mockProductService } from '../src/services/mockProductService.js';
import { PRODUCT_FIELDS, filterProducts, isPortableImage, productsJSON, readProductDocument, toProductDocument } from '../src/utils/products.js';
import { validateLogin, validateProduct } from '../src/utils/validation.js';

test('Document/JSON chỉ có bốn trường; price và soluong là number; không xuất id hoặc password', () => {
  const product = { id: 'not-a-field', name: '  Sản phẩm A  ', price: '12500,5', soluong: '2', image: '', password: 'not-exported', createdAt: 123 };
  const document = toProductDocument(product);
  assert.deepEqual(Object.keys(document), PRODUCT_FIELDS);
  assert.deepEqual(document, { name: 'Sản phẩm A', price: 12500.5, soluong: 2, image: '' });
  assert.deepEqual(JSON.parse(productsJSON([product])), [document]);
  assert.throws(() => readProductDocument({ ...document, id: 'extra' }));
  assert.throws(() => readProductDocument({ ...document, price: '12500' }));
});

test('Kiểm tra số: chấp nhận 0 và giá thập phân; chặn trống, âm, NaN, Infinity, số lượng lẻ và số quá lớn', () => {
  assert.deepEqual(validateProduct({ name: 'A', price: '0', soluong: '0' }), {});
  assert.deepEqual(validateProduct({ name: 'A', price: '1,5', soluong: '10' }), {});
  for (const price of ['', ' ', '-1', 'abc', 'NaN', 'Infinity', '1e999', '0x10', '9007199254740992']) {
    assert.ok(validateProduct({ name: 'A', price, soluong: '1' }).price);
  }
  for (const soluong of ['', '-1', '1.5', '2,5', 'Infinity', '9007199254740992']) {
    assert.ok(validateProduct({ name: 'A', price: '1', soluong }).soluong);
  }
  assert.ok(validateProduct({ name: ' ', price: '1', soluong: '1' }).name);
  assert.ok(validateLogin('wrong-email', '', true).email);
  assert.ok(validateLogin('a@example.com', '123', true).password);
});

test('Không chấp nhận URI ảnh cục bộ, chỉ cho HTTPS hoặc dữ liệu ảnh di chuyển được', () => {
  for (const image of ['file://avatar.jpg', 'content://image/1', 'blob:temporary', 'http://insecure/image.png', 'javascript:alert(1)']) {
    assert.equal(isPortableImage(image), false);
    assert.throws(() => toProductDocument({ name: 'A', price: 1, soluong: 1, image }));
  }
  assert.equal(isPortableImage('https://example.com/photo.jpg'), true);
  assert.equal(isPortableImage('data:image/png;base64,aGVsbG8='), true);
});

test('Lọc tên không phân biệt hoa/thường và sắp xếp giá mà không sửa mảng gốc', () => {
  const items = [{ name: 'Bàn phím', price: 300 }, { name: 'Chuột', price: 100 }, { name: 'BÀN nhỏ', price: 200 }];
  assert.equal(filterProducts(items, 'bÀn', 'default').length, 2);
  assert.deepEqual(filterProducts(items, '', 'asc').map((item) => item.price), [100, 200, 300]);
  assert.deepEqual(filterProducts(items, '', 'desc').map((item) => item.price), [300, 200, 100]);
  assert.deepEqual(items.map((item) => item.price), [300, 100, 200]);
});

test('CRUD mock phát danh sách mới và hủy subscription đúng lúc', async () => {
  let products = [];
  let events = 0;
  const unsubscribe = mockProductService.subscribe((items) => { products = items; events++; }, assert.fail);
  const count = products.length;
  const id = await mockProductService.add({ name: 'Test A', price: '10', soluong: '0', image: '' });
  assert.equal(products.length, count + 1);
  await mockProductService.update(id, { name: 'Test B', price: 25, soluong: 3, image: '' });
  assert.equal(products.find((item) => item.id === id).price, 25);
  assert.ok((await mockProductService.listForExport()).every((item) => Object.keys(item).length === 4));
  await mockProductService.remove(id);
  assert.equal(products.length, count);
  assert.equal(events, 4);
  await assert.rejects(mockProductService.update(id, { name: 'A', price: 1, soluong: 1 }));
  await assert.rejects(mockProductService.remove(id));
  unsubscribe();
  const anotherId = await mockProductService.add({ name: 'Cleanup', price: 0, soluong: 0 });
  await mockProductService.remove(anotherId);
  assert.equal(events, 4);
});
