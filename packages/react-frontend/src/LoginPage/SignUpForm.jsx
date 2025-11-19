// src/LoginPage/SignUpForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.css"; // reuse same CSS

const BASE_URL = "collision-sim-backend-hwexdffvd3c5c7e9.westus3-01.azurewebsites.net";

export default function SignUpForm() {
  const nav = useNavigate();
  const [creds, setCreds] = useState({ username: "", pwd: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setCreds((p) => ({ ...p, [name === "password" ? "pwd" : "username"]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });

      if (res.status !== 201) {
        const txt = await res.text();
        throw new Error(`Signup failed (${res.status}). ${txt || ""}`.trim());
      }

      const { token } = await res.json();
      localStorage.setItem("auth_token", token);
      nav("/dashboard");
    } catch (e2) {
      setErr(e2.message || "Signup error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Sign Up</h2>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={creds.username}
          onChange={onChange}
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={creds.pwd}
          onChange={onChange}
          autoComplete="new-password"
          required
        />

        {err && <p className="auth-error">{err}</p>}

        <button type="submit" disabled={busy}>
          {busy ? "Signing up…" : "Sign Up"}
        </button>

        <p className="auth-alt">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </form>
    </div>
  );
}
