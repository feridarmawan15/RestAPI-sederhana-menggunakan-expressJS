import { useState, useEffect } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: null, name: '', description: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      alert('Gagal mengambil data kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/categories/${form.id}`, form);
      } else {
        await api.post('/categories', form);
      }
      setShowModal(false);
      setForm({ id: null, name: '', description: '' });
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan kategori');
    }
  };

  const handleEdit = (cat) => {
    setForm(cat);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin menghapus kategori ini? (Bisa gagal jika masih ada barang di kategori ini)')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus kategori');
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h2>
        <button 
          onClick={() => { setForm({ id: null, name: '', description: '' }); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Tambah Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : categories.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500">
            Belum ada data kategori.
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit size={16} /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
              <p className="text-gray-600 text-sm">{cat.description || 'Tidak ada deskripsi'}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">{form.id ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"></textarea>
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
