import { useSimStore } from "../store";
export default function RoadPage(){
  const { road, setRoad } = useSimStore();
  return (
    <div className="page">
      <aside className="card">
        <h3>道路几何</h3>
        <div className="form-row"><label>坡度 (deg)</label><input type="number" step="0.5" value={road.grade_deg} onChange={e=>setRoad({grade_deg:+e.target.value})}/></div>
        <div className="form-row"><label>车道数</label><input type="number" value={road.lanes} onChange={e=>setRoad({lanes:+e.target.value})}/></div>
        <div className="form-row"><label>弯道半径 (m)</label><input type="number" value={road.radius} onChange={e=>setRoad({radius:+e.target.value})}/></div>
      </aside>
      <main className="card"><h3>说明</h3><p className="help">当前 1D 引擎，弯道先占位。</p></main>
    </div>
  );
}
