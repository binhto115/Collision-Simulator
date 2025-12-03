import { useSimStore } from "../store";
export default function RoadPage(){
  const { road, setRoad } = useSimStore();
  return (
    <div className="page">
      <aside className="card">
        <h3>Road geometry</h3>
        <div className="form-row"><label>Slope (deg)</label><input type="number" step="0.5" value={road.grade_deg} onChange={e=>setRoad({grade_deg:+e.target.value})}/></div>
        <div className="form-row"><label>Line count</label><input type="number" value={road.lanes} onChange={e=>setRoad({lanes:+e.target.value})}/></div>
        <div className="form-row"><label>Curve radius (m)</label><input type="number" value={road.radius} onChange={e=>setRoad({radius:+e.target.value})}/></div>
      </aside>
      <main className="card"><h3>note</h3><p className="help">Still developing</p></main>
    </div>
  );
}
