// src/simHub.jsx
import React, { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation} from "react-router-dom";

export default function SimHub({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;

  function handleLogout() {
    // Clear both tokens
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Clear token in REACT state
    setToken("INVALID_TOKEN");
    
    // Go  back to login page
    navigate("/", { replace: true });
  }

  // If no email in current state, user didn't come from login page. Send them back to login
  useEffect(() => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      // If no token or invalid token on logout, then log out
      if (!token || token == "INVALID_TOKEN" || !email) {
      navigate("/", { replace: true});
    }
  }, [email, navigate]);

  return (
    <div style={{ padding: 24, minHeight: "100vh", position: "relative" }}>
      <style>
        {`
          .logout-button {
            position: fixed;
            top: 16px;
            right: 16px;
            padding: 10px 18px;
            background: transparent;
            color: #333;
            border: 2px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.2s ease, border-color 0.2s ease;
            z-index: 1000;
          }
      
          .logout-button:hover {
            background: #333;
            border-color: #ccc;
          }

          .nav-link {
            display: inline-block;
            padding: 8px 14px;
            background: transparent;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.95rem;
            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          }
          
          .nav-link:link,
          .nav-link:visited,
          .nav-link:hover,
          .nav-link:active {
            text-decoration: none
          }

          .nav-link:hover {
            background: #333;
            color: white;
            border-color: #333;
            text-decoration: none;
          }
        `}
      </style>

      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <h1 style={{ marginTop: "40px", position: "fixed" }}>CrashLab 2D — Link Hub</h1>

      {email && (
        <p style={{ marginTop: "4px", marginBottom: "8px"}}>
          Welcome {email}
        </p>
      )}
      
      <div
          style={{
          display: "flex",
          gap: "20px",
          marginTop: "12px",
          flexWrap: "wrap",
          }}
      >
        {/* SLO-2D-UI pages */}
        <Link to="simulate" className="nav-link" state={{ email }}>Simulator</Link>
        {/* <Link to="driver" className="nav-link" state={{ email }}>Driver</Link> */}
        <Link to="vehicles" className="nav-link" state={{ email }}>Vehicles</Link>
        <Link to="road" className="nav-link" state={{ email }}>Road</Link>
        {/* <Link to="weather" className="nav-link" state={{ email }}>Weather</Link>
        <Link to="settings" className="nav-link" state={{ email }}>Settings</Link>
        <Link to="library" className="nav-link" state={{ email }}>Library</Link> */}
      </div>

      <div style={{ marginTop: "40px"}}>
        <Outlet/>
      </div>
    </div>
  );
}
