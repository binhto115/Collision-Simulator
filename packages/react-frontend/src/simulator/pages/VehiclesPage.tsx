import { useSimStore } from "../store";
export default function VehiclesPage(){
  const { vehicle, setVehicle } = useSimStore();
  return (
    <div className="page">
      <aside className="card">
        <h3>车辆库</h3>
        <div className="help">选择或自定义车辆参数（质量、长度、CdA 等）</div>
        <div className="form-row"><label>车型名</label><input value={vehicle.name} onChange={e=>setVehicle({name:e.target.value})}/></div>
        <div className="form-row"><label>质量 (kg)</label><input type="number" value={vehicle.mass} onChange={e=>setVehicle({mass:+e.target.value})}/></div>
        <div className="form-row"><label>车长 (m)</label><input type="number" step="0.1" value={vehicle.length} onChange={e=>setVehicle({length:+e.target.value})}/></div>
        <div className="form-row"><label>CdA (m²)</label><input type="number" step="0.01" value={vehicle.CdA} onChange={e=>setVehicle({CdA:+e.target.value})}/></div>
        <div className="toolbar"><button className="primary">保存为模板</button><button className="ghost">导入</button></div>
      </aside>
      <main className="card">
        <h3>说明</h3>
        <p className="help">这里编辑的数值会作为默认值传入模拟页面。后续可支持车型库。</p>
      </main>
    </div>
  );
}
