import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = async (name: string, email: string) => {
    await axios.post("https://frontend-take-home-service.fetch.com/auth/login", { name, email }, { withCredentials: true });
    setUser({ name, email });
  };

  const logout = async () => {
    await axios.post("https://frontend-take-home-service.fetch.com/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
