import { useSimStore } from "../store";
export default function DriverPage(){
  const { driver, setDriver } = useSimStore();
  return (
    <div className="page">
      <aside className="card">
        <h3>Driver</h3>
        <div className="form-row"><label>Reaction Time (s)</label><input type="number" step="0.1" value={driver.reaction} onChange={e=>setDriver({reaction:+e.target.value})}/></div>
        <div className="form-row"><label>Follow Distance (s)</label><input type="number" step="0.1" value={driver.headway} onChange={e=>setDriver({headway:+e.target.value})}/></div>
        <div className="form-row"><label>Braking Motivation</label><input type="number" step="0.1" value={driver.brakeGain} onChange={e=>setDriver({brakeGain:+e.target.value})}/></div>
        <div className="form-row"><label>Distraction Probability</label><input type="number" step="0.01" value={driver.distractProb} onChange={e=>setDriver({distractProb:+e.target.value})}/></div>
      </aside>
      <main className="card"><h3>Note</h3><p className="help">Default driver profile used in the case generation phase</p></main>
    </div>
  );
}
