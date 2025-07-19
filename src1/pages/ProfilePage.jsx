import { useSelector } from 'react-redux';

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-4 rounded shadow w-full max-w-md">
        <p className="mb-2"><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
        <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
        <p className="mb-2"><strong>Role:</strong> {user?.role || 'user'}</p>
        <p className="text-sm text-gray-400">(Static profile — no backend update yet)</p>
      </div>
    </div>
  );
}