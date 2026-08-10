import { createContext, useState } from "react";

export const AuthContext = createContext();

const INITIAL_USER = {
  name: "Tủn",
  email: "tun.nguyen@example.com",
  avatar: "https://ui-avatars.com/api/?name=Tủn&background=ff3838&color=fff",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("smart_food_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER; // Default demo user
  });

  const [token, setToken] = useState(() => localStorage.getItem("smart_food_token") || "demo-jwt-token");

  const isAuthenticated = Boolean(user && token);

  const login = (userData, userToken = "demo-jwt-token") => {
    const activeUser = userData || INITIAL_USER;
    setUser(activeUser);
    setToken(userToken);
    localStorage.setItem("smart_food_user", JSON.stringify(activeUser));
    localStorage.setItem("smart_food_token", userToken);
  };

  const register = (userData) => {
    login(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("smart_food_user");
    localStorage.removeItem("smart_food_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
