// src/MyApp.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import SimHub from "./simHub"
import Table from "./Components/Table";
import Form from "./Components/Form";
import LoginForm from "./LoginPage/LoginForm";
import SignUpForm from "./LoginPage/SignUpForm";
import LegacySim from "./simulator/LegacySim";
import ForgotPasswordForm from "./LoginPage/ForgotPasswordForm";
import ResetPasswordPage from "./LoginPage/ResetPasswordPage";

// --- slo-2d-ui pages (place files at: src/simulator/pages/*.tsx)
const DriverPage   = lazy(() => import("./simulator/pages/DriverPage"));
const VehiclesPage = lazy(() => import("./simulator/pages/VehiclesPage"));
const RoadPage     = lazy(() => import("./simulator/pages/RoadPage"));
const WeatherPage  = lazy(() => import("./simulator/pages/WeatherPage"));
const SettingsPage = lazy(() => import("./simulator/pages/SettingsPage"));
const LibraryPage  = lazy(() => import("./simulator/pages/LibraryPage"));
const SimPage      = lazy(() => import("./simulator/pages/SimPage")); // if present

//const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://crashlab-backend-cga7hqa8f6cbbage.westus3-01.azurewebsites.net"

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
  const INVALID_TOKEN = "INVALID_TOKEN";

  // On app load, pick up from "Remember me" or session login
  const getStoredToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    INVALID_TOKEN;

  const [token, setToken] = useState(getStoredToken());
  const isAuthenticated = token && token !== INVALID_TOKEN;

  const [_characters, setCharacters] = useState([]);

  // Helper function that adds the correct Authorization header.
  // function addAuthHeader(otherHeaders = {}) {
  //   if (token === INVALID_TOKEN) {
  //     return otherHeaders;
  //   } else {
  //     return {
  //       ...otherHeaders,
  //       Authorization: `Bearer ${token}`,
  //     };
  //   }
  // }

  // --- API helpers ---
  // function postUser(person) {
  //   return fetch(`${BASE_URL}/users`, {
  //     method: "POST",
  //     headers: addAuthHeader({ "Content-Type": "application/json" }),
  //     body: JSON.stringify(person),
  //   });
  // }

  // function deleteUser(id) {
  //   return fetch(`${BASE_URL}/users/${id}`, {
  //     method: "DELETE",
  //     headers: addAuthHeader({ "Content-Type": "application/json" }),
  //   });
  // }

  // initial load
  useEffect(() => {
    const storedToken = getStoredToken();

    // Build headers based on token existence 
    const hasValidToken = storedToken && storedToken !== INVALID_TOKEN;

    const headers = hasValidToken
        ? { "Content-Type": "application/json",
            Authorization: 'Bearer ${storedToken}',
          }
        : { "Content-Type": "application/json"};
  
    fetch(`${BASE_URL}/users`, { headers })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setCharacters(json["users_list"]);
        } else {
          setCharacters(null);
        }
      })
      .catch((err) => console.log(err));
  }, [token]); // rerun when token changes (login/logout)

  // actions
  // function updateList(person) {
  //   postUser(person)
  //     .then((res) => {
  //       if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
  //       return res.json();
  //     })
  //     .then((created) => setCharacters((prev) => [...prev, created]))
  //     .catch((err) => console.log(err));
  // }

  // function removeOneCharacter(index) {
  //   const userToDelete = characters[index];
  //   if (!userToDelete?._id) return;

  //   deleteUser(userToDelete._id)
  //     .then((res) => {
  //       if (res.status === 204) {
  //         setCharacters((prev) => prev.filter((_, i) => i !== index));
  //       } else if (res.status === 404) {
  //         alert("Resource not found");
  //       } else {
  //         throw new Error(`Failed to delete user (status ${res.status})`);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }

  // --- Routes ---
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route 
          path="/" 
          element= {
            isAuthenticated ? (
              // If Remember Me
              <Navigate to="/simHub" replace />
            ) : (
              <LoginForm setToken={setToken}/>
            )
          } />
        <Route path="/signup" element={<SignUpForm setToken={setToken}/>} />
        <Route path="/forgotpass" element={<ForgotPasswordForm/>}/>
        {/* <Route path="/simHub" element={<SimHub setToken={setToken}/>} /> */}
        
        {/* Sim Hub */}
        <Route 
          path="/simHub" 
          element={
            isAuthenticated ? (
              <SimHub setToken = {setToken} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >

          <Route path="simulate" element={<LegacySim />} />
          <Route path="driver" element={<Suspense fallback={<div>Loading…</div>}><DriverPage /></Suspense>} />
          <Route path="vehicles" element={<Suspense fallback={<div>Loading…</div>}><VehiclesPage /></Suspense>} />
          <Route path="road" element={<Suspense fallback={<div>Loading…</div>}><RoadPage /></Suspense>} />
          <Route path="weather" element={<Suspense fallback={<div>Loading…</div>}><WeatherPage /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<div>Loading…</div>}><SettingsPage /></Suspense>} />
          <Route path="library" element={<Suspense fallback={<div>Loading…</div>}><LibraryPage /></Suspense>} />
        </Route>


        <Route path="/reset-password" element={<ResetPasswordPage/>} />
        
        {/* Simulator */}
        {/* <Route path="/simulate" element={<LegacySim />} /> */}

        {/* slo-2d-ui pages (lazy) */}
        {/* <Route path="/sim/driver"   element={<Suspense fallback={<div>Loading…</div>}><DriverPage /></Suspense>} />
        <Route path="/sim/vehicles" element={<Suspense fallback={<div>Loading…</div>}><VehiclesPage /></Suspense>} />
        <Route path="/sim/road"     element={<Suspense fallback={<div>Loading…</div>}><RoadPage /></Suspense>} />
        <Route path="/sim/weather"  element={<Suspense fallback={<div>Loading…</div>}><WeatherPage /></Suspense>} />
        <Route path="/sim/settings" element={<Suspense fallback={<div>Loading…</div>}><SettingsPage /></Suspense>} />
        <Route path="/sim/library"  element={<Suspense fallback={<div>Loading…</div>}><LibraryPage /></Suspense>} /> */}
        {/* optional */}
        {/* <Route path="/sim" element={<Suspense fallback={<div>Loading…</div>}><SimPage /></Suspense>} /> */}

        {/* Fallback */}
        {/* <Route path="*" element={<Navigate to="/simulate" replace />} /> */}



        
      </Routes>
    </BrowserRouter>
  );
}
