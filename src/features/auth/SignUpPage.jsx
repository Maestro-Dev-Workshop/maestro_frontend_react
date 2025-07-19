import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/authService.js';

export default function SignUpPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    date_of_birth: '',
    gender: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert('Signup successful. Please login.');
      navigate('/login');
    } catch (err) {
      alert('Signup failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
        {['first_name', 'last_name', 'email', 'password', 'date_of_birth', 'gender'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace('_', ' ')}
            type={field === 'password' ? 'password' : 'text'}
            value={form[field]}
            onChange={handleChange}
            required
            className="w-full p-2 border mb-3 rounded"
          />
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
