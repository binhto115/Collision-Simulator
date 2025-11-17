// src/auth/AuthContext.jsx
import React, { createContext, useMemo, useState, useCallback } from "react";
import { API_BASE } from "./AuthConfig";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [message, setMessage] = useState("");

  const saveToken = useCallback((t) => {
    setToken(t || null);
    if (t) localStorage.setItem("auth_token", t);
    else localStorage.removeItem("auth_token");
  }, []);

  const login = useCallback(async ({ username, pwd }) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pwd }),
    });

    if (res.status !== 200) throw new Error(`Login failed (${res.status})`);
    const { token } = await res.json();
    saveToken(token);
    return token;
  }, [saveToken]);

  const signup = useCallback(async ({ username, pwd }) => {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pwd }),
    });

    if (res.status !== 201) throw new Error(`Signup failed (${res.status})`);
    const { token } = await res.json();
    saveToken(token);
    return token;
  }, [saveToken]);

  const logout = useCallback(() => saveToken(null), [saveToken]);

  const addAuthHeader = useCallback(
    (other = {}) =>
      token ? { ...other, Authorization: `Bearer ${token}` } : other,
    [token]
  );

  const value = useMemo(
    () => ({
      token,
      message,
      setMessage,
      login,
      signup,
      logout,
      addAuthHeader
    }),
    [token, message, login, signup, logout, addAuthHeader]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
