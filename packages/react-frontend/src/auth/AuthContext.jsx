// src/auth/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { API_BASE } from "./AuthConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [message, setMessage] = useState("");

  const saveToken = (t) => {
    setToken(t || null);
    if (t) localStorage.setItem("auth_token", t);
    else localStorage.removeItem("auth_token");
  };

  async function login({ username, pwd }) {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pwd }),
    });
    if (res.status !== 200) throw new Error(`Login failed (${res.status})`);
    const { token } = await res.json();
    saveToken(token);
    return token;
  }

  async function signup({ username, pwd }) {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pwd }),
    });
    if (res.status !== 201) throw new Error(`Signup failed (${res.status})`);
    const { token } = await res.json();
    saveToken(token);
    return token;
  }

  function logout() { saveToken(null); }
  function addAuthHeader(other = {}) {
    return token ? { ...other, Authorization: `Bearer ${token}` } : other;
  }

  const value = useMemo(
    () => ({ token, message, setMessage, login, signup, logout, addAuthHeader }),
    [token, message]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
