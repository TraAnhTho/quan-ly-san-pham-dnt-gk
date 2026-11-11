import { addDoc, collection, deleteDoc, doc, getDocsFromServer, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, firebaseError } from '../config/firebase';
import { AppError } from '../utils/errors';
import { readProductDocument, toProductDocument } from '../utils/products';

function productsRef() {
  if (!db || firebaseError) throw new AppError(firebaseError || 'Chưa khởi tạo Firestore.');
  return collection(db, 'products');
}

export const firestoreProductService = {
  subscribe(onChange, onError) {
    try {
      return onSnapshot(productsRef(), { includeMetadataChanges: true }, (snapshot) => {
        try {
          // Chờ server xác nhận, tránh báo ghi thành công khi chỉ có dữ liệu cục bộ.
          if (snapshot.metadata.hasPendingWrites) return;
          onChange(snapshot.docs.map((item) => ({ id: item.id, ...readProductDocument(item.data()) })), {
            fromCache: snapshot.metadata.fromCache,
          });
        } catch (error) { onError(error); }
      }, onError);
    } catch (error) { onError(error); return () => {}; }
  },
  async add(values) { return (await addDoc(productsRef(), toProductDocument(values))).id; },
  async update(id, values) { await updateDoc(doc(productsRef(), id), toProductDocument(values)); },
  async remove(id) { await deleteDoc(doc(productsRef(), id)); },
  async listForExport() {
    // Đọc từ server, xuất toàn bộ collection; không xuất danh sách đang bị lọc.
    const snapshot = await getDocsFromServer(productsRef());
    return snapshot.docs.map((item) => readProductDocument(item.data()));
  },
};
