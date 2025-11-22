// src/SimHub.jsx   ← also make sure the filename & import use the same casing
import React from "react";
import { Link } from "react-router-dom";

export default function SimHub() {
  const linkStyle = { display: "block", margin: "8px 0" };

  return (
    <div style={{ padding: 24 }}>
        <h1>CrashLab 2D — Link Hub</h1>
        <p>Quick links:</p>

        {/* <Link to="/dashboard" style={linkStyle}>Dashboard</Link> */}
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/signup" style={linkStyle}>Sign Up</Link>

        {/* slo-2d-ui pages */}
        <hr style={{ margin: "16px 0" }} />
        <Link to="/simulate" style={linkStyle}>Simulator</Link>
        <Link to="/sim/driver" style={linkStyle}>Driver</Link>
        <Link to="/sim/vehicles" style={linkStyle}>Vehicles</Link>
        <Link to="/sim/road" style={linkStyle}>Road</Link>
        <Link to="/sim/weather" style={linkStyle}>Weather</Link>
        <Link to="/sim/settings" style={linkStyle}>Settings</Link>
        <Link to="/sim/library" style={linkStyle}>Library</Link>
    </div>
  );
}
