// src/MyApp.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Table from "./Components/Table";
import Form from "./Components/Form";
import LoginForm from "./LoginPage/LoginForm";
import SignUpForm from "./LoginPage/SignUpForm";
import LegacySim from "./simulator/LegacySim";

const DriverPage   = lazy(() => import("./simulator/pages/DriverPage"));
const VehiclesPage = lazy(() => import("./simulator/pages/VehiclesPage"));
const RoadPage     = lazy(() => import("./simulator/pages/RoadPage"));
const WeatherPage  = lazy(() => import("./simulator/pages/WeatherPage"));
const SettingsPage = lazy(() => import("./simulator/pages/SettingsPage"));
const LibraryPage  = lazy(() => import("./simulator/pages/LibraryPage"));
// const SimPage   = lazy(() => import("./simulator/pages/SimPage"));

const BASE_URL  = "http://localhost:8000";
const TOKEN_KEY = "auth_token";

// ------- helpers -------
function addAuthHeader(other = {}) {
  const t = localStorage.getItem(TOKEN_KEY);
  return t ? { ...other, Authorization: `Bearer ${t}` } : { ...other };
}

// Dashboard (Table + Form)
function Dashboard({ characters, removeOneCharacter, updateList }) {
  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default function MyApp() {
  const [characters, setCharacters] = useState(null); // null => “Data Unavailable”
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));


  function saveToken(t) {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);

    setToken(t); // important!
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  // --- API helpers wired with Authorization header ---
  function fetchUsers() {
    return fetch(`${BASE_URL}/users`, {
      headers: addAuthHeader(),
    });
  }

  function postUser(person) {
    return fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: addAuthHeader({ "Content-Type": "application/json" }),
      body: JSON.stringify(person),
    });
  }

  function deleteUser(id) {
    return fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: addAuthHeader(),
    });
  }

  // initial load or when token changes
  useEffect(() => {
    fetchUsers()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setCharacters(json["users_list"]);
        } else {
          setCharacters(null);
        }
      })
      .catch(() => setCharacters(null));
  }, [token]); // re-run when token changes

  // actions
  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
        return res.json();
      })
      .then((created) => setCharacters((prev) => (Array.isArray(prev) ? [...prev, created] : [created])))
      .catch((err) => setMsg(err.message));
  }

  function removeOneCharacter(index) {
    const userToDelete = Array.isArray(characters) ? characters[index] : null;
    if (!userToDelete?._id) return;

    deleteUser(userToDelete._id)
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prev) => prev.filter((_, i) => i !== index));
        } else if (res.status === 404) {
          alert("Resource not found");
        } else {
          throw new Error(`Failed to delete user (status ${res.status})`);
        }
      })
      .catch((err) => setMsg(err.message));
  }

  // Small helpers to log out for testing
  function logout() {
    clearToken();
    setMsg("Logged out (token cleared). Reload dashboard to verify.");
    setCharacters(null);
  }

  return (
    <BrowserRouter>
      <nav style={{ padding: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/simulate">Simulator</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>
        <Link to="/sim/driver">Driver</Link>
        <Link to="/sim/vehicles">Vehicles</Link>
        <Link to="/sim/road">Road</Link>
        <Link to="/sim/weather">Weather</Link>
        <Link to="/sim/settings">Settings</Link>
        <Link to="/sim/library">Library</Link>
      </nav>

      {msg && <div style={{ padding: "6px 12px", color: "#b91c1c" }}>{msg}</div>}

      <Routes>
        {/* Auth — keep your existing pages, just capture token on success */}
        <Route
          path="/login"
          element={
            <LoginForm
              onAuthSuccess={(token) => {
                saveToken(token);
                setMsg("Login success — token saved");
              }}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUpForm
              onAuthSuccess={(token) => {
                saveToken(token);
                setMsg("Signup success — token saved");
              }}
            />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              characters={characters}
              removeOneCharacter={removeOneCharacter}
              updateList={updateList}
            />
          }
        />

        {/* Simulator */}
        <Route path="/simulate" element={<LegacySim />} />

        {/* slo-2d-ui pages */}
        <Route path="/sim/driver"   element={<Suspense fallback={<div>Loading…</div>}><DriverPage /></Suspense>} />
        <Route path="/sim/vehicles" element={<Suspense fallback={<div>Loading…</div>}><VehiclesPage /></Suspense>} />
        <Route path="/sim/road"     element={<Suspense fallback={<div>Loading…</div>}><RoadPage /></Suspense>} />
        <Route path="/sim/weather"  element={<Suspense fallback={<div>Loading…</div>}><WeatherPage /></Suspense>} />
        <Route path="/sim/settings" element={<Suspense fallback={<div>Loading…</div>}><SettingsPage /></Suspense>} />
        <Route path="/sim/library"  element={<Suspense fallback={<div>Loading…</div>}><LibraryPage /></Suspense>} />
        {/* <Route path="/sim" element={<Suspense fallback={<div>Loading…</div>}><SimPage /></Suspense>} /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/simulate" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
