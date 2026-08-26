import { createContext, useState, useEffect } from "react";
import { authApi } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("smart_food_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("smart_food_token") || null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.role === "admin" || user?.role === "manager";

  // Sync profile on mount if token exists
  useEffect(() => {
    if (token && !user) {
      authApi
        .getProfile()
        .then((res) => {
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem("smart_food_user", JSON.stringify(res.data.data));
          }
        })
        .catch(() => {
          logout();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      const { user: userData, token: userToken } = res.data.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem("smart_food_user", JSON.stringify(userData));
      localStorage.setItem("smart_food_token", userToken);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || "Đăng nhập không thành công";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const { user: newUser, token: userToken } = res.data.data;
      setUser(newUser);
      setToken(userToken);
      localStorage.setItem("smart_food_user", JSON.stringify(newUser));
      localStorage.setItem("smart_food_token", userToken);
      return { success: true, user: newUser };
    } catch (err) {
      const message = err.response?.data?.message || "Đăng ký không thành công";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("smart_food_user");
    localStorage.removeItem("smart_food_token");
  };

  const refreshProfile = async () => {
    try {
      const res = await authApi.getProfile();
      if (res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem("smart_food_user", JSON.stringify(res.data.data));
      }
    } catch (e) {
      console.error("Failed to refresh profile", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
