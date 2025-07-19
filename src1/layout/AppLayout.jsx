import { Link, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice.js';

export default function AppLayout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Maestro</h2>
        <nav className="space-y-2">
          <Link to="/" className="block hover:text-blue-300">Dashboard</Link>
          <Link to="/session/new" className="block hover:text-blue-300">New Session</Link>
          <Link to="/profile" className="block hover:text-blue-300">Profile</Link>
          <button onClick={handleLogout} className="block text-left w-full mt-4 hover:text-red-400">Logout</button>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
