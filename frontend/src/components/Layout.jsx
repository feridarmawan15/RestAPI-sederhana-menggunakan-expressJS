import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, List, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">GUDANG<span className="text-indigo-400">PRO</span></h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link 
            to="/" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <Package size={20} />
            <span>Data Barang</span>
          </Link>
          <Link 
            to="/categories" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/categories' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <List size={20} />
            <span>Kategori</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-indigo-200 hover:bg-indigo-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">GUDANGPRO</h1>
          <button onClick={handleLogout} className="text-indigo-200"><LogOut size={24}/></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
