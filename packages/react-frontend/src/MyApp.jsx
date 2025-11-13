// src/MyApp.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Table from "./Components/Table";
import Form from "./Components/Form";
import LoginForm from "./LoginPage/LoginForm";
import SignUpForm from "./LoginPage/SignUpForm";
import LegacySim from "./simulator/LegacySim";

// --- slo-2d-ui pages (place files at: src/simulator/pages/*.tsx)
const DriverPage   = lazy(() => import("./simulator/pages/DriverPage"));
const VehiclesPage = lazy(() => import("./simulator/pages/VehiclesPage"));
const RoadPage     = lazy(() => import("./simulator/pages/RoadPage"));
const WeatherPage  = lazy(() => import("./simulator/pages/WeatherPage"));
const SettingsPage = lazy(() => import("./simulator/pages/SettingsPage"));
const LibraryPage  = lazy(() => import("./simulator/pages/LibraryPage"));
const SimPage      = lazy(() => import("./simulator/pages/SimPage")); // if present

const BASE_URL = "http://localhost:8000";

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
  const [characters, setCharacters] = useState([]);

  // --- API helpers ---
  function fetchUsers() {
    return fetch(`${BASE_URL}/users`);
  }
  function postUser(person) {
    return fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
  }
  function deleteUser(id) {
    return fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
  }

  // initial load
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((err) => console.log(err));
  }, []);

  // actions
  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
        return res.json();
      })
      .then((created) => setCharacters((prev) => [...prev, created]))
      .catch((err) => console.log(err));
  }

  function removeOneCharacter(index) {
    const userToDelete = characters[index];
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
      .catch((err) => console.log(err));
  }

  // --- Routes ---
  return (
    <BrowserRouter>
      <nav style={{ padding: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/simulate">Simulator</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/">Login</Link>
        <Link to="/signup">Sign Up</Link>
        {/* slo-2d-ui pages */}
        <Link to="/sim/driver">Driver</Link>
        <Link to="/sim/vehicles">Vehicles</Link>
        <Link to="/sim/road">Road</Link>
        <Link to="/sim/weather">Weather</Link>
        <Link to="/sim/settings">Settings</Link>
        <Link to="/sim/library">Library</Link>
      </nav>

      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

        {/* App pages */}
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

        {/* slo-2d-ui pages (lazy) */}
        <Route path="/sim/driver"   element={<Suspense fallback={<div>Loading…</div>}><DriverPage /></Suspense>} />
        <Route path="/sim/vehicles" element={<Suspense fallback={<div>Loading…</div>}><VehiclesPage /></Suspense>} />
        <Route path="/sim/road"     element={<Suspense fallback={<div>Loading…</div>}><RoadPage /></Suspense>} />
        <Route path="/sim/weather"  element={<Suspense fallback={<div>Loading…</div>}><WeatherPage /></Suspense>} />
        <Route path="/sim/settings" element={<Suspense fallback={<div>Loading…</div>}><SettingsPage /></Suspense>} />
        <Route path="/sim/library"  element={<Suspense fallback={<div>Loading…</div>}><LibraryPage /></Suspense>} />
        {/* optional */}
        <Route path="/sim" element={<Suspense fallback={<div>Loading…</div>}><SimPage /></Suspense>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/simulate" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
