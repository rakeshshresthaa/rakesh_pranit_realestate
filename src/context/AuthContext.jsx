import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      // Mock API call - replace with actual authentication
      const mockUser = {
        id: Date.now(),
        email,
        role,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=0ea5e9&color=fff`,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      // Mock API call - replace with actual registration
      const mockUser = {
        id: Date.now(),
        email,
        role,
        name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=0ea5e9&color=fff`,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
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
