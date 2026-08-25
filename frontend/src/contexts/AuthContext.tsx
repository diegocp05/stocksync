import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (data: any) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('@StockSync:token');
    const storedUser = localStorage.getItem('@StockSync:user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function signIn({ email, password }: any) {
    const response = await api.post('/auth/login', { email, password });
    
    const { token, user } = response.data;

    localStorage.setItem('@StockSync:token', token);
    localStorage.setItem('@StockSync:user', JSON.stringify(user));

    setUser(user);
    navigate('/');
  }

  async function signUp({ name, email, password }: any) {
    await api.post('/auth/register', { name, email, password, role: 'ADMIN' });
    await signIn({ email, password });
  }

  function signOut() {
    localStorage.removeItem('@StockSync:token');
    localStorage.removeItem('@StockSync:user');
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
