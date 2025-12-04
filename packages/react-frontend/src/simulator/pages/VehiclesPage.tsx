import { useSimStore } from "../store";

export default function VehiclesPage() {
  const { vehicle, setVehicle } = useSimStore();

  return (
    <main className="page">
      <div className="page-section">
        <h2>Vehicle parameters</h2>
        <p className="help">
          These values are shared with the Simulator. Changes here are used the
          next time you run a scenario.
        </p>

        <div className="page-grid-3">
          <label>
            <span className="cap">Ego mass (kg)</span>
            <input
              type="number"
              value={vehicle.mE}
              onChange={(e) => setVehicle({ mE: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Lead mass (kg)</span>
            <input
              type="number"
              value={vehicle.m1}
              onChange={(e) => setVehicle({ m1: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Second mass (kg)</span>
            <input
              type="number"
              value={vehicle.m2}
              onChange={(e) => setVehicle({ m2: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Ego CdA (m²)</span>
            <input
              type="number"
              step={0.01}
              value={vehicle.CdAE}
              onChange={(e) => setVehicle({ CdAE: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Lead CdA (m²)</span>
            <input
              type="number"
              step={0.01}
              value={vehicle.CdA1}
              onChange={(e) => setVehicle({ CdA1: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Second CdA (m²)</span>
            <input
              type="number"
              step={0.01}
              value={vehicle.CdA2}
              onChange={(e) => setVehicle({ CdA2: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Ego length (m)</span>
            <input
              type="number"
              step={0.1}
              value={vehicle.lenE}
              onChange={(e) => setVehicle({ lenE: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Lead length (m)</span>
            <input
              type="number"
              step={0.1}
              value={vehicle.len1}
              onChange={(e) => setVehicle({ len1: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Second length (m)</span>
            <input
              type="number"
              step={0.1}
              value={vehicle.len2}
              onChange={(e) => setVehicle({ len2: Number(e.target.value) })}
            />
          </label>
        </div>
      </div>
    </main>
  );
}
