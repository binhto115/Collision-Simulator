import "./SimLayout.css";
//import "./styles.css";
import { useEffect, useRef, useState } from "react";
import { createInitialState, stepOnce, drawFrame } from "./sim";
import type { SimConfig, CCRKind } from "./sim";
import { kph2mps } from "./physics";

const defaultCfg: SimConfig = {
  kind: "CCRm",
  weather: "clear",
  light: "daylight",
  surface: "asphalt",
  airTempC: 20,
  altitude_m: 0,
  headwind_mps: 0,
  waterFilm_mm: 0,
  tirePressure_psi: 35,
  treadDepth_mm: 6,
  surfaceRoughness: 0.3,
  muOverride: null,
  e: 0.2,
  reactionDelayS: 0.0,
  ttcTriggerS: 1.6,
  leadDecel1: 0,
  fps: 20,
  durationS: 6,
  vE0: kph2mps(50),
  vL10: kph2mps(20),
  vL20: 0,
  gap1: 25,
  gap2: 12,
  cars: 2,
  grade_deg: 0,
  mE: 1500, m1: 1500, m2: 1500,
  CdAE: 0.65, CdA1: 0.65, CdA2: 0.65,
  // Vehicle length (m). ≥ 6.0 renders as a truck silhouette (rendering only).
  lenE: 4.5, len1: 4.5, len2: 4.5,
  zoom: 1.0
};

type RandSpec = { en:boolean; min:number; max:number };
type RandMap  = Record<string, RandSpec>;

const defaultRand: RandMap = {
  vE0_kph:  { en:true,  min:20,  max:80 },
  v1_0_kph: { en:true,  min:0,   max:70 },
  v2_0_kph: { en:false, min:0,   max:70 },
  gap1:     { en:true,  min:10,  max:60 },
  gap2:     { en:true,  min:10,  max:60 },
  mE:       { en:false, min:1100,max:2200 },
  m1:       { en:false, min:1100,max:2200 },
  m2:       { en:false, min:1100,max:2200 },
  CdAE:     { en:false, min:0.5, max:0.9 },
  CdA1:     { en:false, min:0.5, max:0.9 },
  CdA2:     { en:false, min:0.5, max:0.9 },
  e:        { en:false, min:0.05,max:0.5 },
  ttc:      { en:false, min:1.2, max:2.6 },
  leadDec:  { en:false, min:-7,  max:-1 },
  grade:    { en:false, min:-6,  max:6 }
};

function rnd(min:number,max:number){ return min + Math.random()*(max-min); }
function clamp(x:number, a:number, b:number){ return Math.max(a, Math.min(b,x)); }
function Tip({text}:{text:string}){ return <span className="tip" title={text}>?</span>; }


// --- Export/Import types & helpers ---
type RunExport = {
  type: "slo2d-run";
  version: 1;
  savedAt: string;
  cfg: SimConfig;
};

function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Merge with defaults and clamp a few fields so bad files can't break the sim
function sanitizeCfg(p: Partial<SimConfig>): SimConfig {
  const merged: SimConfig = {
    ...defaultCfg,
    ...p,
  };
  merged.fps        = clamp(Number(merged.fps), 5, 60);
  merged.durationS  = clamp(Number(merged.durationS), 2, 20);
  merged.cars       = Math.max(2, Math.min(3, Number(merged.cars)));
  merged.e          = clamp(Number(merged.e), 0.05, 0.6);
  merged.ttcTriggerS= clamp(Number(merged.ttcTriggerS), 1.0, 3.0);
  merged.grade_deg  = clamp(Number(merged.grade_deg), -8, 8);
  merged.zoom       = clamp(Number(merged.zoom), 0.5, 2.5);
  return merged;
}

export default function App(){
  const [cfg, setCfg] = useState<SimConfig>(defaultCfg);
  const [running, setRunning] = useState(false);
  const [state, setState] = useState(()=>createInitialState({...defaultCfg}));
  const [rand, setRand] = useState<RandMap>(defaultRand);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);


  function reset(){
    const c = {...cfg};                  // clone
    const s = createInitialState(c);     // applies template + randomization to c
    setCfg(c);                           // write randomized result back to UI
    setState(s);
    setRunning(false);
  }

   function exportRun(){
    const payload: RunExport = {
      type: "slo2d-run",
      version: 1,
      savedAt: new Date().toISOString(),
      cfg,
    };
    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
    downloadJSON(payload, `slo2d-run-${stamp}.json`);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if (!f) return;
    try{
      const text = await f.text();
      const obj = JSON.parse(text);
      if (obj?.type !== "slo2d-run" || !obj?.cfg) {
        throw new Error("Unrecognized file format");
      }
      const merged = sanitizeCfg(obj.cfg);
      setRunning(false);
      setCfg(merged);
      setState(createInitialState({ ...merged }));
    }catch(err:any){
      alert(`Import failed: ${err?.message ?? String(err)}`);
    }finally{
      // allow re-importing the same file later
      e.target.value = "";
    }
  }

  function triggerImport(){
    fileRef.current?.click();
  }


  useEffect(()=>{ reset(); /* eslint-disable-next-line */ },
    [cfg.kind, cfg.weather, cfg.light, cfg.cars, cfg.zoom, cfg.fps, cfg.lenE, cfg.len1, cfg.len2, cfg.grade_deg, cfg.surface, cfg.airTempC, cfg.altitude_m, cfg.headwind_mps, cfg.waterFilm_mm, cfg.tirePressure_psi, cfg.treadDepth_mm, cfg.surfaceRoughness]);

  // Fixed timestep + accumulator
  const rafRef = useRef<number|undefined>(undefined);
  const lastRef = useRef<number>(0);
  const accRef  = useRef<number>(0);

  useEffect(()=>{
    if (!running){
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) drawFrame(ctx, state, cfg);
      return;
    }
    lastRef.current = performance.now();
    accRef.current  = 0;

    const loop = ()=>{
      const now = performance.now();
      accRef.current += (now - lastRef.current)/1000;
      lastRef.current = now;
      const fixedDt = 1 / cfg.fps;
      while (accRef.current >= fixedDt){
        state.dt = fixedDt;
        stepOnce(state, cfg);
        accRef.current -= fixedDt;
      }
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) drawFrame(ctx, state, cfg);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return ()=>{ if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, cfg.fps, cfg.ttcTriggerS, cfg.leadDecel1, cfg.muOverride, cfg.weather, cfg.grade_deg]);

  // Wheel zoom (hold Ctrl/Shift)
  useEffect(()=>{
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e:WheelEvent)=>{
      if (!e.ctrlKey && !e.shiftKey) return;
      e.preventDefault();
      const f = e.deltaY > 0 ? 0.9 : 1.1;
      setCfg(prev=>({...prev, zoom: clamp(Number((prev.zoom*f).toFixed(2)), 0.5, 2.5)}));
    };
    el.addEventListener("wheel", onWheel, {passive:false});
    return ()=> el.removeEventListener("wheel", onWheel);
  }, [canvasRef.current]);

  const onChange = (patch:Partial<SimConfig>) => setCfg(prev=>({...prev, ...patch}));

  function randomizeOnce(){
    const r = rand; const patch: Partial<SimConfig> = {};
    if (r["vE0_kph"].en)  patch.vE0  = kph2mps(rnd(r["vE0_kph"].min,  r["vE0_kph"].max));
    if (r["v1_0_kph"].en) patch.vL10 = kph2mps(rnd(r["v1_0_kph"].min, r["v1_0_kph"].max));
    if (cfg.cars>=3 && r["v2_0_kph"].en) patch.vL20 = kph2mps(rnd(r["v2_0_kph"].min, r["v2_0_kph"].max));
    if (r["gap1"].en) patch.gap1 = rnd(r["gap1"].min, r["gap1"].max);
    if (cfg.cars>=3 && r["gap2"].en) patch.gap2 = rnd(r["gap2"].min, r["gap2"].max);
    if (r["mE"].en)  patch.mE  = Math.round(rnd(r["mE"].min,  r["mE"].max));
    if (r["m1"].en)  patch.m1  = Math.round(rnd(r["m1"].min,  r["m1"].max));
    if (cfg.cars>=3 && r["m2"].en)  patch.m2  = Math.round(rnd(r["m2"].min,  r["m2"].max));
    if (r["CdAE"].en) patch.CdAE = rnd(r["CdAE"].min, r["CdAE"].max);
    if (r["CdA1"].en) patch.CdA1 = rnd(r["CdA1"].min, r["CdA1"].max);
    if (cfg.cars>=3 && r["CdA2"].en) patch.CdA2 = rnd(r["CdA2"].min, r["CdA2"].max);
    if (r["e"].en)     patch.e = rnd(r["e"].min, r["e"].max);
    if (r["ttc"].en)   patch.ttcTriggerS = rnd(r["ttc"].min, r["ttc"].max);
    if (r["leadDec"].en) patch.leadDecel1 = rnd(r["leadDec"].min, r["leadDec"].max);
    if (r["grade"].en) patch.grade_deg = Math.round(rnd(r["grade"].min, r["grade"].max));
    setCfg(prev=>({...prev, ...patch}));
    setRunning(false); setTimeout(()=>reset(),0);
  }

  function toggleAllRandom(force?: boolean){
    setRand(prev=>{
      const keys = Object.keys(prev);
      const anyUnchecked = keys.some(k => !prev[k].en);
      const to = (typeof force === "boolean") ? force : anyUnchecked;
      const next: RandMap = {} as any;
      for (const k of keys) next[k] = { ...prev[k], en: to };
      return next;
    });
  }

  const RandRow = (key:string, label:string, unit:string, step=1, digits=0) => {
    const spec = rand[key];
    const set = (patch:Partial<RandSpec>) => setRand(prev=>({...prev, [key]:{...prev[key], ...patch}}));
    return (
      <div className="rand-row" key={key}>
        <input type="checkbox" checked={spec.en} onChange={e=>set({en:e.target.checked})}/>
        <span>{label}</span>
        <input type="number" step={step} value={spec.min.toFixed(digits)} onChange={e=>set({min:Number(e.target.value)})}/>
        <input type="number" step={step} value={spec.max.toFixed(digits)} onChange={e=>set({max:Number(e.target.value)})}/>
        <span style={{opacity:.7}}>{unit}</span>
      </div>
    );
  };

  const allSelected = Object.values(rand).every(s=>s.en);

  return (
    <div className="sim-root">
      {/* LEFT: controls */}
      <div className="sim-left">
        <div className="card">
          <h3>Scenario / Environment</h3>
          <div className="row2">
            <label>
              <span className="cap">
                Template
                <Tip text="Euro NCAP rear-end scenarios: CCRs (stationary), CCRm (moving), CCRb (braking), or Custom."/>
              </span>
              <select value={cfg.kind} onChange={e=>onChange({kind:e.target.value as CCRKind})}>
                <option>CCRs</option><option>CCRm</option><option>CCRb</option><option>Custom</option>
              </select>
            </label>
            <label>
              <span className="cap">Vehicle count</span>
              <select value={cfg.cars} onChange={e=>onChange({cars:Number(e.target.value)})}>
                <option value={2}>2</option><option value={3}>3</option>
              </select>
            </label>
          </div>

          <div className="row3">
            <label>
              <span className="cap">Weather</span>
              <select value={cfg.weather} onChange={e=>onChange({weather:e.target.value as any})}>
                <option>clear</option><option>raining</option><option>snowing</option><option>fog</option>
              </select>
            </label>
            <label>
              <span className="cap">Lighting</span>
              <select value={cfg.light} onChange={e=>onChange({light:e.target.value as any})}>
                <option>daylight</option><option>night</option>
              </select>
            </label>
            <label>
              <span className="cap">Grade (deg)</span>
              <input type="number" step={1} min={-8} max={8} value={cfg.grade_deg}
                onChange={e=>onChange({grade_deg:Number(e.target.value)})}/>
            </label>
          </div>

          <div className="row3">
            <label>
              <span className="cap">Restitution e<Tip text="Collision coefficient of restitution: 0 = plastic, 1 = elastic."/></span>
              <input type="number" step="0.01" min="0.05" max="0.6" value={cfg.e}
                onChange={e=>onChange({e:Number(e.target.value)})}/>
            </label>
            <label>
              <span className="cap">AEB trigger TTC (s)</span>
              <input type="number" step="0.1" min="1.0" max="3.0" value={cfg.ttcTriggerS}
                onChange={e=>onChange({ttcTriggerS:Number(e.target.value)})}/>
            </label>
            <label>
              <span className="cap">View zoom</span>
              <div style={{display:"grid", gridTemplateColumns:"1fr 60px 60px", gap:6}}>
                <input type="range" min="0.5" max="2.5" step="0.1" value={cfg.zoom}
                  onChange={e=>onChange({zoom:Number(e.target.value)})}/>
                <button className="ghost" onClick={()=>onChange({zoom: clamp(cfg.zoom-0.1,0.5,2.5)})}>-</button>
                <button className="ghost" onClick={()=>onChange({zoom: clamp(cfg.zoom+0.1,0.5,2.5)})}>+</button>
              </div>
            </label>
          </div>

          <div className="row3">
            <label><span className="cap">FPS</span>
              <input type="number" step={1} min={5} max={60} value={cfg.fps}
                onChange={e=>onChange({fps: clamp(Number(e.target.value),5,60)})}/>
            </label>
            <label><span className="cap">Duration (s)</span>
              <input type="number" step={0.5} min={2} max={20} value={cfg.durationS}
                onChange={e=>onChange({durationS: clamp(Number(e.target.value),2,20)})}/>
            </label>
          </div>

          <div className="actions">
            <button className="primary" onClick={()=>setRunning(true)}>Play</button>
            <button onClick={()=>setRunning(false)}>Pause</button>
            <button onClick={()=>{ setRunning(false); reset(); }}>Reset</button>
            <button className="ghost" onClick={exportRun}>Export</button>
            <button onClick={triggerImport}>Import</button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,.txt"
              style={{ display: "none" }}
              onChange={handleImportFile}
            />
          </div>
        </div>

        <div className="card">
          <h3>Initial conditions</h3>
          <div className="row3">
            <label><span className="cap">Ego speed (km/h)</span>
              <input type="number" value={(cfg.vE0*3.6).toFixed(0)} onChange={e=>onChange({vE0: Number(e.target.value)/3.6})}/>
            </label>
            <label><span className="cap">Lead speed (km/h)</span>
              <input type="number" value={(cfg.vL10*3.6).toFixed(0)} onChange={e=>onChange({vL10: Number(e.target.value)/3.6})}/>
            </label>
            {cfg.cars>=3 && (
              <label><span className="cap">Second lead speed (km/h)</span>
                <input type="number" value={(cfg.vL20*3.6).toFixed(0)} onChange={e=>onChange({vL20: Number(e.target.value)/3.6})}/>
              </label>
            )}
            <label><span className="cap">Ego → lead gap (m)</span>
              <input type="number" value={cfg.gap1} onChange={e=>onChange({gap1: Number(e.target.value)})}/>
            </label>
            {cfg.cars>=3 && (
              <label><span className="cap">Lead → 2nd gap (m)</span>
                <input type="number" value={cfg.gap2} onChange={e=>onChange({gap2: Number(e.target.value)})}/>
              </label>
            )}
            <label><span className="cap">Lead decel (m/s²)</span>
              <input type="number" step="0.1" value={cfg.leadDecel1} onChange={e=>onChange({leadDecel1: Number(e.target.value)})}/>
            </label>
          </div>
        </div>

        <div className="card">
          <h3>Vehicle parameters</h3>
          <div className="row3">
            <label><span className="cap">Ego mass (kg)</span>
              <input type="number" value={cfg.mE} onChange={e=>onChange({mE: Number(e.target.value)})}/>
            </label>
            <label><span className="cap">Lead mass (kg)</span>
              <input type="number" value={cfg.m1} onChange={e=>onChange({m1: Number(e.target.value)})}/>
            </label>
            {cfg.cars>=3 && (
              <label><span className="cap">Second mass (kg)</span>
                <input type="number" value={cfg.m2} onChange={e=>onChange({m2: Number(e.target.value)})}/>
              </label>
            )}
            <label><span className="cap">Ego CdA (m²)<Tip text="Drag coefficient × frontal area."/></span>
              <input type="number" step="0.01" value={cfg.CdAE} onChange={e=>onChange({CdAE: Number(e.target.value)})}/>
            </label>
            <label><span className="cap">Lead CdA (m²)</span>
              <input type="number" step="0.01" value={cfg.CdA1} onChange={e=>onChange({CdA1: Number(e.target.value)})}/>
            </label>
            {cfg.cars>=3 && (
              <label><span className="cap">Second CdA (m²)</span>
                <input type="number" step="0.01" value={cfg.CdA2} onChange={e=>onChange({CdA2: Number(e.target.value)})}/>
              </label>
            )}
            {/* Vehicle length: ≥ 6.0 renders as truck (rendering only) */}
            <label><span className="cap">Ego length (m)<Tip text="≥ 6.0 m renders as a truck silhouette."/></span>
              <input type="number" step="0.1" min="2" max="18" value={cfg.lenE}
                onChange={e=>onChange({lenE: Number(e.target.value)})}/>
            </label>
            <label><span className="cap">Lead length (m)</span>
              <input type="number" step="0.1" min="2" max="18" value={cfg.len1}
                onChange={e=>onChange({len1: Number(e.target.value)})}/>
            </label>
            {cfg.cars>=3 && (
              <label><span className="cap">Second length (m)</span>
                <input type="number" step="0.1" min="2" max="18" value={cfg.len2}
                  onChange={e=>onChange({len2: Number(e.target.value)})}/>
              </label>
            )}
          </div>
        </div>

        <div className="card">
          <h3>Randomize (check + set range → generate)</h3>
          <div className="rand-head"><span></span><span>Param</span><span>Min</span><span>Max</span><span>Unit</span></div>
          {RandRow("vE0_kph","Ego speed","km/h", 1,0)}
          {RandRow("v1_0_kph","Lead speed","km/h", 1,0)}
          {cfg.cars>=3 && RandRow("v2_0_kph","Second speed","km/h", 1,0)}
          {RandRow("gap1","Ego → lead gap","m", 1,0)}
          {cfg.cars>=3 && RandRow("gap2","Lead → 2nd gap","m", 1,0)}
          {RandRow("mE","Ego mass","kg", 10,0)}
          {RandRow("m1","Lead mass","kg", 10,0)}
          {cfg.cars>=3 && RandRow("m2","Second mass","kg", 10,0)}
          {RandRow("CdAE","Ego CdA","m²", 0.01,2)}
          {RandRow("CdA1","Lead CdA","m²", 0.01,2)}
          {cfg.cars>=3 && RandRow("CdA2","Second CdA","m²", 0.01,2)}
          {RandRow("e","Restitution e","", 0.01,2)}
          {RandRow("ttc","AEB TTC","s", 0.1,1)}
          {RandRow("leadDec","Lead decel","m/s²", 0.1,1)}
          {RandRow("grade","Grade","deg", 1,0)}
          <div className="actions" style={{marginTop:8}}>
            <button className="ghost" onClick={()=>toggleAllRandom()}>
              {allSelected ? "Unselect all" : "Select all"}
            </button>
            <button onClick={randomizeOnce}>Randomize</button>
            <button className="primary" onClick={()=>setRunning(true)}>Play</button>
            <button onClick={()=>setRunning(false)}>Pause</button>
            <button onClick={()=>{ setRunning(false); reset(); }}>Reset</button>
          </div>
        </div>

        <div className="card">
          <h3>Road & Conditions</h3>
          <div className="row">
            <div className="col">
              <label>Surface</label>
              <select value={cfg.surface} onChange={e=>onChange({surface: e.target.value as any})}>
                <option value="asphalt">asphalt</option>
                <option value="concrete">concrete</option>
                <option value="gravel">gravel</option>
                <option value="ice">ice</option>
              </select>
            </div>
            <div className="col">
              <label>Water film (mm)</label>
              <input type="number" step="0.1" value={cfg.waterFilm_mm}
                onChange={e=>onChange({waterFilm_mm: Number(e.target.value)})}/>
            </div>
            <div className="col">
              <label>Tire pressure (psi)</label>
              <input type="number" step="1" value={cfg.tirePressure_psi}
                onChange={e=>onChange({tirePressure_psi: Number(e.target.value)})}/>
            </div>
            <div className="col">
              <label>Tread depth (mm)</label>
              <input type="number" step="0.5" value={cfg.treadDepth_mm}
                onChange={e=>onChange({treadDepth_mm: Number(e.target.value)})}/>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label>Air temp (°C)</label>
              <input type="number" step="1" value={cfg.airTempC}
                onChange={e=>onChange({airTempC: Number(e.target.value)})}/>
            </div>
            <div className="col">
              <label>Altitude (m)</label>
              <input type="number" step="50" value={cfg.altitude_m}
                onChange={e=>onChange({altitude_m: Number(e.target.value)})}/>
            </div>
            <div className="col">
              <label>Head/tail wind (m/s)</label>
              <input type="number" step="0.5" value={cfg.headwind_mps}
                onChange={e=>onChange({headwind_mps: Number(e.target.value)})}/>
            </div>
            <div className="col">
              <label>Surface roughness (0–1)</label>
              <input type="number" step="0.05" min="0" max="1" value={cfg.surfaceRoughness}
                onChange={e=>onChange({surfaceRoughness: Math.max(0, Math.min(1, Number(e.target.value)))})}/>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: canvas */}
      <div className="sim-right">
        <div className="card canvas-card">
          <div className="canvas-wrap">
            <canvas ref={canvasRef} className="sim-canvas" width={1280} height={560}/>
          </div>
        </div>
      </div>
    </div>
  );
}
