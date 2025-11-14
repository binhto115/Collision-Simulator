import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
        login(token);                // <- stores in context + localStorage
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

  return (
    <form onSubmit={onSubmit} className="login-form">
      <label htmlFor="username">Username</label>
      <input id="username" name="username" value={creds.username} onChange={onChange} />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" value={creds.pwd} onChange={onChange} />

      <button type="submit">Log In</button>
      {msg && <p style={{marginTop: 8, opacity: 0.8}}>{msg}</p>}
    </form>
  );
}
