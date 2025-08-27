import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const coerceUser = (u) => {
  if (!u) return u;
  const numericId = typeof u.id === 'string' && /^\d+$/.test(u.id) ? Number(u.id) : u.id;
  return {
    ...u,
    id: numericId,
    role: (u.role || '').toLowerCase(),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(coerceUser(parsed));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const { data: users } = await axios.get(`${BASE_URL}/users`, { params: { email, password, ...(role ? { role } : {}) } });
      const found = users[0];
      if (!found) return { success: false, error: 'Invalid credentials' };
      const authUser = coerceUser({
        id: found.id,
        email: found.email,
        role: found.role,
        name: found.name,
        avatar: found.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(found.name)}`,
      });
      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
      return { success: true, user: authUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const payload = { name, email, password, role: (role || 'user').toLowerCase(), avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}` };
      const { data: created } = await axios.post(`${BASE_URL}/users`, payload);
      const authUser = coerceUser({ id: created.id, name: created.name, email: created.email, role: created.role, avatar: created.avatar });
      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
      return { success: true, user: authUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates) => {
    const updatedUser = coerceUser({ ...user, ...updates });
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user;
  const isAgent = user?.role === 'agent';
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const value = {
    user,
    loading,
    isAuthenticated,
    isAgent,
    isAdmin,
    isUser,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
