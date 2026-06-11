import { useState, useEffect } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: null, name: '', quantity: 0, price: 0, categoryId: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, catRes] = await Promise.all([
        api.get('/items'),
        api.get('/categories')
      ]);
      setItems(itemsRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error(error);
      alert('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/items/${form.id}`, form);
      } else {
        await api.post('/items', form);
      }
      setShowModal(false);
      setForm({ id: null, name: '', quantity: 0, price: 0, categoryId: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan barang');
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item, categoryId: item.categoryId });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      try {
        await api.delete(`/items/${id}`);
        fetchData();
      } catch (error) {
        alert('Gagal menghapus');
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Data Barang (Stok)</h2>
        <button 
          onClick={() => { setForm({ id: null, name: '', quantity: 0, price: 0, categoryId: categories[0]?.id || '' }); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Tambah Barang
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Nama Barang</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Stok</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Memuat data...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Belum ada data barang.</td></tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.category?.name || '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${item.quantity < 5 ? 'text-red-500' : 'text-green-600'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">Rp {item.price.toLocaleString('id-ID')}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">{form.id ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select required value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input type="number" min="0" required value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input type="number" min="0" required value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
