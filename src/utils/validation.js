export function validateLogin(email, password, demo = false) {
  const errors = /** @type {Record<string, string>} */ ({});
  if (!email.trim()) errors.email = 'Vui lòng nhập email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Email chưa đúng định dạng.';
  if (!password) errors.password = 'Vui lòng nhập mật khẩu.';
  else if (demo && password.length < 6) errors.password = 'Mật khẩu minh họa cần ít nhất 6 ký tự.';
  return errors;
}

export function validateProduct(values) {
  const errors = /** @type {Record<string, string>} */ ({});
  const name = String(values.name ?? '').trim();
  const price = String(values.price ?? '').trim();
  const quantity = String(values.soluong ?? '').trim();
  if (!name) errors.name = 'Vui lòng nhập tên sản phẩm.';
  else if (name.length > 120) errors.name = 'Tên sản phẩm tối đa 120 ký tự.';
  if (!price) errors.price = 'Vui lòng nhập giá.';
  else if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(price) || !Number.isFinite(Number(price.replace(',', '.')))
    || Number(price.replace(',', '.')) > Number.MAX_SAFE_INTEGER) errors.price = 'Giá phải là số không âm, trong giới hạn an toàn.';
  if (!quantity) errors.soluong = 'Vui lòng nhập số lượng.';
  else if (!/^\d+$/.test(quantity) || !Number.isSafeInteger(Number(quantity))) errors.soluong = 'Số lượng phải là số nguyên không âm, trong giới hạn an toàn.';
  return errors;
}
