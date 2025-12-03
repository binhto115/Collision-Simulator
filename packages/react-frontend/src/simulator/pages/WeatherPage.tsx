import { useSimStore } from "../store";
export default function WeatherPage(){
  const { env, setEnv } = useSimStore();
  return (
    <div className="page">
      <aside className="card">
        <h3>Weather parameter</h3>
        <div className="form-row"><label>Weather</label>
          <select value={env.weather} onChange={e=>setEnv({weather:e.target.value as any})}>
            <option value="clear">Clear</option><option value="raining">Raining</option><option value="snowing">Snowing</option><option value="fog">Fog</option>
          </select>
        </div>
        <div className="form-row"><label>Road surface</label>
          <select value={env.surface} onChange={e=>setEnv({surface:e.target.value as any})}>
            <option value="dry">Dry</option><option value="wet">Wet</option><option value="snow">Snow</option><option value="ice">Ice</option>
          </select>
        </div>
        <div className="form-row"><label>Air density ρ</label><input type="number" step="0.01" value={env.rho} onChange={e=>setEnv({rho:+e.target.value})}/></div>
        <div className="form-row"><label>Rolling Resistance Crr</label><input type="number" step="0.001" value={env.Crr} onChange={e=>setEnv({Crr:+e.target.value})}/></div>
      </aside>
      <main className="card"><h3>Note</h3><p className="help">Weather/The road surface is mapped as μ、Crr、ρ。</p></main>
    </div>
  );
}
