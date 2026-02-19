import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, getRole, getUser, removeToken } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  role: string | null;
  user: any | null;
  isAuthenticated: boolean;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  user: null,
  isAuthenticated: false,
  logout: () => {},
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [role, setRole] = useState<string | null>(getRole());
  const [user, setUser] = useState<any | null>(getUser());

  const refreshAuth = () => {
    setToken(getToken());
    setRole(getRole());
    setUser(getUser());
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, isAuthenticated: !!token, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
