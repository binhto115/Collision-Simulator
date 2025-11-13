import { useSimStore } from "../store";
export default function DriverPage(){
  const { driver, setDriver } = useSimStore();
  return (
    <div className="page">
      <aside className="card">
        <h3>驾驶员画像</h3>
        <div className="form-row"><label>反应时 (s)</label><input type="number" step="0.1" value={driver.reaction} onChange={e=>setDriver({reaction:+e.target.value})}/></div>
        <div className="form-row"><label>跟车时距 (s)</label><input type="number" step="0.1" value={driver.headway} onChange={e=>setDriver({headway:+e.target.value})}/></div>
        <div className="form-row"><label>制动积极性</label><input type="number" step="0.1" value={driver.brakeGain} onChange={e=>setDriver({brakeGain:+e.target.value})}/></div>
        <div className="form-row"><label>分心概率</label><input type="number" step="0.01" value={driver.distractProb} onChange={e=>setDriver({distractProb:+e.target.value})}/></div>
      </aside>
      <main className="card"><h3>说明</h3><p className="help">用于案例生成阶段的默认驾驶员画像。</p></main>
    </div>
  );
}
