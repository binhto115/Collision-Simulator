// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Table from "./Components/Table";
import Form from "./Components/Form";
import LoginForm from "./LoginPage/LoginForm";
import SignUpForm from "./LoginPage/SignUpForm";
import LegacySim from "./simulator/LegacySim";

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
      <nav style={{ padding: 8, display: "flex", gap: 12 }}>
        <Link to="/simulate">Collision Simulator</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/">Login</Link>
        <Link to="/signup">Sign Up</Link>
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/simulate" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
