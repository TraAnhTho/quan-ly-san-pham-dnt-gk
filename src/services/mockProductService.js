import { demoProducts } from '../data/demoProducts.js';
import { AppError } from '../utils/errors.js';
import { toProductDocument } from '../utils/products.js';

const documents = new Map(demoProducts.map((product, index) => [String(index + 1), toProductDocument(product)]));
const listeners = new Set();
let sequence = documents.size;
const snapshot = () => Array.from(documents, ([id, data]) => ({ id, ...data }));
const notify = () => listeners.forEach((listener) => listener(snapshot()));

export const mockProductService = {
  subscribe(onChange, onError) {
    listeners.add(onChange);
    try { onChange(snapshot()); } catch (error) { onError(error); }
    return () => { listeners.delete(onChange); };
  },
  async add(values) {
    const document = toProductDocument(values);
    const id = String(++sequence);
    documents.set(id, document);
    notify();
    return id;
  },
  async update(id, values) {
    if (!documents.has(id)) throw new AppError('Sản phẩm không còn tồn tại.');
    documents.set(id, toProductDocument(values));
    notify();
  },
  async remove(id) {
    if (!documents.delete(id)) throw new AppError('Sản phẩm không còn tồn tại.');
    notify();
  },
  async listForExport() { return Array.from(documents.values(), (data) => ({ ...data })); },
};
