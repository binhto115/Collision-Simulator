import { useSimStore } from "../store";
export default function VehiclesPage(){
  const { vehicle, setVehicle } = useSimStore();
  return (
    <div className="page">
      <aside className="card">
        <h3>Vehicle Library</h3>
        <div className="help">Choose or customize vehicle parameter（Mass、Length、CdA etc）</div>
        <div className="form-row"><label>Vehicle name</label><input value={vehicle.name} onChange={e=>setVehicle({name:e.target.value})}/></div>
        <div className="form-row"><label>Mass (kg)</label><input type="number" value={vehicle.mass} onChange={e=>setVehicle({mass:+e.target.value})}/></div>
        <div className="form-row"><label>Length (m)</label><input type="number" step="0.1" value={vehicle.length} onChange={e=>setVehicle({length:+e.target.value})}/></div>
        <div className="form-row"><label>CdA (m²)</label><input type="number" step="0.01" value={vehicle.CdA} onChange={e=>setVehicle({CdA:+e.target.value})}/></div>
        <div className="toolbar"><button className="primary">Save as template</button><button className="ghost">Import</button></div>
      </aside>
      <main className="card">
        <h3>Note</h3>
        <p className="help">Customized paremeter will be import into the main simulator page. Will support vehicle library in the future.</p>
      </main>
    </div>
  );
}
