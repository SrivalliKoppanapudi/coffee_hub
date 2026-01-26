import React, { createContext, useEffect, useState } from "react";
import { api } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api("http://localhost:8080/auth/logout", {
        method: "POST",
     
      });
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // 🔥 Restore session
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api("http://localhost:8080/auth/me", {
    
        });

        if (!res.ok) throw new Error("Not logged in");

        const data = await res.json();
        login({
          email: data.email,
          role: data.roles[0]?.authority,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
