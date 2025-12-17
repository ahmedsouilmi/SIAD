import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../api/axiosConfig";

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      api.get("/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    const res = await api.post("/login", form);
    const accessToken = res.data.access_token;
    setToken(accessToken);
    localStorage.setItem("token", accessToken);

    // Fetch user info
    const userRes = await api.get("/me");
    setUser(userRes.data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
