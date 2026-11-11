import { useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Platform, Text, View } from 'react-native';
import { isDemo } from '../config/firebase';
import { discardUpload, inlineImages, prepareImage } from '../services/imageService';
import { errorMessage } from '../utils/errors';
import { validateProduct } from '../utils/validation';
import { ui } from '../theme';
import Button from './Button';
import Dialog from './Dialog';
import Field from './Field';
import ProductImage from './ProductImage';

export default function ProductForm({ product, onSave, onClose }) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [soluong, setQuantity] = useState(product ? String(product.soluong) : '');
  const [imageURL, setImageURL] = useState(product?.image?.startsWith('https://') ? product.image : '');
  const [retainedImage, setRetainedImage] = useState(product?.image || '');
  const [asset, setAsset] = useState(null);
  const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const preview = asset?.uri || imageURL || retainedImage;

  async function chooseImage() {
    setMessage('');
    try {
      // Không chờ yêu cầu quyền trước thao tác này trên web: cần kích hoạt trực tiếp từ nút bấm.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: Platform.OS !== 'web', aspect: [1, 1], quality: 0.6,
      });
      if (!result.canceled && result.assets?.[0]) setAsset(result.assets[0]);
    } catch { setMessage('Không mở được thư viện ảnh. Kiểm tra quyền truy cập hoặc dùng URL ảnh.'); }
  }

  function removeImage() { setAsset(null); setImageURL(''); setRetainedImage(''); }

  async function submit() {
    if (saving.current) return;
    const nextErrors = validateProduct({ name, price, soluong });
    setErrors(nextErrors);
    setMessage('');
    if (Object.keys(nextErrors).length) return;
    saving.current = true;
    setBusy(true);
    let uploadedPath = null;
    try {
      const prepared = await prepareImage(asset, imageURL || retainedImage);
      uploadedPath = prepared.uploadedPath;
      await onSave({ name, price, soluong, image: prepared.image });
    } catch (error) {
      await discardUpload(uploadedPath);
      setMessage(errorMessage(error));
    } finally { saving.current = false; setBusy(false); }
  }

  return <Dialog title={product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'} subtitle="Thông tin ngắn gọn, quản lý dễ dàng." onClose={busy ? () => {} : onClose}>
    <View style={[ui.row, { alignItems: 'flex-start', marginBottom: 18 }]}>
      <ProductImage uri={preview} size={94} />
      <View style={{ flex: 1, gap: 8 }}>
        <Button title="Chọn ảnh" icon="image" variant="secondary" onPress={chooseImage} disabled={busy} />
        {preview ? <Button title="Bỏ ảnh" variant="secondary" onPress={removeImage} disabled={busy} /> : null}
        <Text style={ui.helper}>{inlineImages ? 'Ảnh JPEG, PNG, WebP, GIF · tối đa 500 KB.' : 'Ảnh tải lên tối đa 5 MB.'}</Text>
      </View>
    </View>
    {!isDemo && inlineImages ? <Text style={[ui.helper, { marginBottom: 15 }]}>Ảnh nhỏ được lưu trực tiếp trong trường image của Firestore. Bạn cũng có thể nhập URL ảnh HTTPS bên dưới.</Text> : null}
    <Field label="Tên sản phẩm *" placeholder="Ví dụ: Bàn phím không dây" value={name} onChangeText={setName}
      error={errors.name} editable={!busy} maxLength={120} />
    <Field label="Giá sản phẩm (VNĐ) *" placeholder="Ví dụ: 350000" value={price} onChangeText={setPrice}
      error={errors.price} editable={!busy} keyboardType="decimal-pad" maxLength={30} />
    <Field label="Số lượng *" placeholder="Ví dụ: 10" value={soluong} onChangeText={setQuantity}
      error={errors.soluong} editable={!busy} keyboardType="number-pad" maxLength={16} />
    <Field label="URL ảnh HTTPS (không bắt buộc)" placeholder="https://..." value={imageURL}
      onChangeText={(value) => { setImageURL(value); setAsset(null); setRetainedImage(''); }}
      editable={!busy} autoCapitalize="none" autoCorrect={false} keyboardType="url" maxLength={4000} />
    <Text style={[ui.helper, { marginBottom: 16 }]}>Không nhập dấu phân cách hàng nghìn. Giá có thể dùng dấu chấm hoặc phẩy thập phân; số lượng là số nguyên. Bỏ ảnh để dùng hình mặc định.</Text>
    {message ? <Text accessibilityRole="alert" style={[ui.error, { marginBottom: 16 }]}>{message}</Text> : null}
    <View style={ui.row}>
      <Button title="Hủy" variant="secondary" onPress={onClose} disabled={busy} style={{ flex: 1 }} />
      <Button title={product ? 'Lưu thay đổi' : 'Thêm sản phẩm'} icon="check" busy={busy} onPress={submit} style={{ flex: 2 }} />
    </View>
  </Dialog>;
}
