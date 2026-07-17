import { createContext, useContext, useEffect, useState, useCallback } from "react";
import apiClient from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem("authToken")) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await apiClient.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const applyAuthResponse = useCallback(({ token, user: authenticatedUser }) => {
    localStorage.setItem("authToken", token);
    setUser(authenticatedUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await apiClient.post("/auth/login", { email, password });
      applyAuthResponse(data);
    },
    [applyAuthResponse]
  );

  const register = useCallback(
    async (name, email, password) => {
      const { data } = await apiClient.post("/auth/register", { name, email, password });
      applyAuthResponse(data);
    },
    [applyAuthResponse]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
