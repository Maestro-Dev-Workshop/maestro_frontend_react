import { useSelector } from 'react-redux';

export default function useAuth() {
  const { user, token } = useSelector((state) => state.auth);
  return { isAuthenticated: !!token, user };
}
