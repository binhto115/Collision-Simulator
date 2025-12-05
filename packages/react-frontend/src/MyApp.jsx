import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import SimHub from "./simHub"
import LoginForm from "./LoginPage/LoginForm";
import SignUpForm from "./LoginPage/SignUpForm";
import LegacySim from "./simulator/LegacySim";
import ForgotPasswordForm from "./LoginPage/ForgotPasswordForm";
import ResetPasswordPage from "./LoginPage/ResetPasswordPage";

const VehiclesPage = lazy(() => import("./simulator/pages/VehiclesPage"));
const RoadPage     = lazy(() => import("./simulator/pages/RoadPage"));


//const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://crashlab-backend-cga7hqa8f6cbbage.westus3-01.azurewebsites.net"

export default function MyApp() {
  const INVALID_TOKEN = "INVALID_TOKEN";

  const getStoredToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    INVALID_TOKEN;

  const [token, setToken] = useState(getStoredToken());
  const [_characters, setCharacters] = useState([]);


  useEffect(() => {
    const storedToken = getStoredToken();
    const hasValidToken = storedToken && storedToken !== INVALID_TOKEN;
    const headers = hasValidToken ? { "Content-Type": "application/json", Authorization: 'Bearer ${storedToken}',}: { "Content-Type": "application/json"};
  
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
  }, [token]); 

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginForm setToken={setToken}/>} />
        <Route path="/signup" element={<SignUpForm setToken={setToken}/>} />
        <Route path="/forgotpass" element={<ForgotPasswordForm/>}/>

        <Route path="/simHub" element={<SimHub setToken={setToken} />}>
          <Route path="simulate" element={<LegacySim />} />
          <Route path="vehicles" element={<Suspense fallback={<div>Loading…</div>}><VehiclesPage /></Suspense>} />
          <Route path="road" element={<Suspense fallback={<div>Loading…</div>}><RoadPage /></Suspense>} />
        </Route>

        <Route path="/reset-password" element={<ResetPasswordPage/>} />

      </Routes>
    </BrowserRouter>
  );
}
