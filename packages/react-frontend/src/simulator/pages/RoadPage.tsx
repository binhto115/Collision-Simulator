import { useSimStore } from "../store";

export default function RoadPage() {
  const { road, setRoad } = useSimStore();

  return (
    <main className="page">
      <div className="page-section">
        <h2>Road &amp; conditions</h2>
        <p className="help">
          Road surface and environment parameters used by the simulator for
          braking and drag calculations.
        </p>

        <div className="page-grid-3">
          <label>
            <span className="cap">Surface</span>
            <select
              value={road.surface}
              onChange={(e) => setRoad({ surface: e.target.value as any })}
            >
              <option value="asphalt">asphalt</option>
              <option value="concrete">concrete</option>
              <option value="gravel">gravel</option>
              <option value="ice">ice</option>
            </select>
          </label>

          <label>
            <span className="cap">Water film (mm)</span>
            <input
              type="number"
              step={0.1}
              value={road.waterFilm_mm}
              onChange={(e) =>
                setRoad({ waterFilm_mm: Number(e.target.value) })
              }
            />
          </label>

          <label>
            <span className="cap">Tire pressure (psi)</span>
            <input
              type="number"
              step={1}
              value={road.tirePressure_psi}
              onChange={(e) =>
                setRoad({ tirePressure_psi: Number(e.target.value) })
              }
            />
          </label>

          <label>
            <span className="cap">Tread depth (mm)</span>
            <input
              type="number"
              step={0.5}
              value={road.treadDepth_mm}
              onChange={(e) =>
                setRoad({ treadDepth_mm: Number(e.target.value) })
              }
            />
          </label>

          <label>
            <span className="cap">Air temp (°C)</span>
            <input
              type="number"
              step={1}
              value={road.airTempC}
              onChange={(e) => setRoad({ airTempC: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Altitude (m)</span>
            <input
              type="number"
              step={50}
              value={road.altitude_m}
              onChange={(e) => setRoad({ altitude_m: Number(e.target.value) })}
            />
          </label>

          <label>
            <span className="cap">Head/tail wind (m/s)</span>
            <input
              type="number"
              step={0.5}
              value={road.headwind_mps}
              onChange={(e) =>
                setRoad({ headwind_mps: Number(e.target.value) })
              }
            />
          </label>

          <label>
            <span className="cap">Surface roughness (0–1)</span>
            <input
              type="number"
              step={0.05}
              min={0}
              max={1}
              value={road.surfaceRoughness}
              onChange={(e) =>
                setRoad({
                  surfaceRoughness: Math.max(
                    0,
                    Math.min(1, Number(e.target.value))
                  ),
                })
              }
            />
          </label>
        </div>
      </div>
    </main>
  );
}
