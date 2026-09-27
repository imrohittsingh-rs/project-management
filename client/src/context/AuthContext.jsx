import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser
} from "../services/authService.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response?.data?.data?.user || null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (userData) => {
    const response = await registerService(userData);
    return response.data;
  };

  const login = async (userData) => {
    const response = await loginService(userData);
    setUser(response?.data?.data?.user || null);
    return response.data;
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
