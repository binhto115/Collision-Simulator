// src/LoginPage/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { useAuth } from "../auth/AuthContextInternal";
import { useSafeAuth } from "../auth/useSafeAuth";
import { API_BASE } from "../auth/AuthConfig";  
//const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function LoginForm() {
  const navigate = useNavigate();
  const auth = useSafeAuth();

  const [creds, setCreds] = useState({ username: "", pwd: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setCreds((s) => ({ ...s, [name === "password" ? "pwd" : name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("Logging in…");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });

      if (res.status === 200) {
        const { token } = await res.json();

        // Prefer AuthContext if present; otherwise fall back to localStorage
        if (auth && typeof auth.login === "function") {
          auth.login(token);
        } else {
          localStorage.setItem("auth_token", token);
        }

        setMsg("Login successful. Redirecting…");
        navigate("/dashboard", { replace: true });
      } else {
        const txt = await res.text();
        setMsg(`Login failed (${res.status}). ${txt || ""}`);
      }
    } catch (err) {
      setMsg(`Login error: ${String(err)}`);
    }
  }

  // Inline styles so global CSS can't hide anything
  const wrap = {
    display: "grid",
    placeItems: "center",
    minHeight: "calc(100vh - 120px)",
    padding: "24px 12px",
  };
  const card = {
    width: "min(420px, 92vw)",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 8px 24px rgba(0,0,0,.08)",
    color: "#0b0f14",
  };
  const title = { margin: 0, marginBottom: 12, fontSize: 22, fontWeight: 700 };
  const form = { display: "grid", gap: 10 };
  const label = { fontSize: 13, opacity: 0.9 };
  const input = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    background: "#fff",
    color: "#0b0f14",
    fontSize: 14,
  };
  const btn = {
    background: "#0a84ff",
    color: "#fff",
    border: "none",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 4,
  };
  const hint = { marginTop: 8, fontSize: 12, opacity: 0.75 };

  return (
    <div style={wrap}>
      <div style={card}>
        <h2 style={title}>Log in</h2>
        <form onSubmit={onSubmit} style={form}>
          <label htmlFor="username" style={label}>Username</label>
          <input
            id="username"
            name="username"
            value={creds.username}
            onChange={onChange}
            style={input}
            autoComplete="username"
            required
          />

          <label htmlFor="password" style={label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={creds.pwd}
            onChange={onChange}
            style={input}
            autoComplete="current-password"
            required
          />

          <button type="submit" style={btn}>Log In</button>
        </form>

        {msg && <p style={hint}>{msg}</p>}
      </div>
    </div>
  );
}
