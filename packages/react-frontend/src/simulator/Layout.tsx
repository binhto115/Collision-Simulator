import { NavLink, Outlet } from "react-router-dom";
import { useEffect } from "react";
import "./styles.css";

export default function Layout() {
  // Turn on/off simulator theme when we enter/leave the simulator routes
  useEffect(() => {
    document.body.classList.add("simulator-theme");
    return () => {
      document.body.classList.remove("simulator-theme");
    };
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">🚗 CrashLab</div>
          <nav className="nav">
            <NavLink to="/simulate">模拟</NavLink>
            <NavLink to="/vehicles">车辆</NavLink>
            <NavLink to="/driver">驾驶员</NavLink>
            <NavLink to="/weather">天气</NavLink>
            <NavLink to="/road">道路</NavLink>
            <NavLink to="/library">库</NavLink>
            <NavLink to="/settings">设置</NavLink>
          </nav>
          <div
            style={{
              textAlign: "right",
              color: "var(--muted)",
              fontSize: 12,
            }}
          >
            v0.1
          </div>
        </div>
      </header>
      {/* spacer so content isn't hidden behind the fixed navbar */}
      <div className="spacer" />
      <Outlet />
    </>
  );
}
