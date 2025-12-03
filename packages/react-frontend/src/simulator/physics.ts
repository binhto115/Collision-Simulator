export type Weather = "clear" | "raining" | "snowing" | "fog";
export type Surface = "asphalt" | "concrete" | "gravel" | "ice";
export interface PhysParams {
  m: number; rho: number; CdA: number; Crr: number;
  grade: number; mu0: number; muSpeedDecay: number;
  jerk: number; aebTargetG: number;
  headwind_mps: number;
  waterFilm_mm: number;
  tirePressure_psi: number;
  treadDepth_mm: number;
}


function airDensity(airTempC:number, altitude_m:number){
  const T = airTempC + 273.15;
  const rho0 = 1.225;            // 15°C @ sea level
  const scaleH = 8500;
  const rhoAlt = rho0 * Math.exp(-altitude_m/scaleH);
  return rhoAlt * (288.15 / Math.max(200, T));
}

function hydroplaneSpeed_mps(psi:number = 35){
  // V_hydro_mph ≈ 9 * sqrt(psi)
  return 0.44704 * 9 * Math.sqrt(Math.max(psi, 1));
}

function waterMuFactor(v:number, water_mm:number = 0, psi:number = 35, tread_mm:number = 6){
  if (water_mm <= 0.1) return 1;
  const Vh = hydroplaneSpeed_mps(psi) * (1 + 0.03 * (tread_mm - 3));
  if (v <= 0.6*Vh) return 1;
  const over = (v - 0.6*Vh) / (0.8*Vh);
  const k = Math.min(1, Math.max(0, over)) * (water_mm/2.0);
  return Math.max(0.2, 1 - 0.8*k);
}

export function pickPhysParamsFromEnv(
  weather: Weather,
  surface: Surface = "asphalt",
  grade_deg = 0,
  mass_kg = 1500,
  CdA = 0.65,
  airTempC = 20,
  altitude_m = 0,
  surfaceRoughness = 0.3,
  headwind_mps = 0,
  waterFilm_mm = 0,
  tirePressure_psi = 35,
  treadDepth_mm = 6
): PhysParams {
  // Base dry μ by surface, then weather adjustments
  const baseMuBySurface: Record<Surface, number> = {
    asphalt: 0.85, concrete: 0.90, gravel: 0.65, ice: 0.20
  };
  let mu0 = baseMuBySurface[surface];
  if (weather === "raining") mu0 *= 0.70;
  else if (weather === "snowing") mu0 *= (surface === "ice" ? 1.0 : 0.35);
  else if (weather === "fog") mu0 *= 0.95;

  // Rolling resistance with roughness/weather
  const CrrBaseBySurface: Record<Surface, number> = {
    asphalt: 0.012, concrete: 0.011, gravel: 0.028, ice: 0.010
  };
  let Crr = CrrBaseBySurface[surface] * (1 + 0.5 * surfaceRoughness);
  if (weather === "raining") Crr *= 1.15;

  const muSpeedDecay = (weather === "raining") ? 0.25 : 0.10;

  
  const rho = airDensity(airTempC, altitude_m);

  return {
    m: mass_kg,
    rho,
    CdA,
    Crr,
    grade: grade_deg * Math.PI / 180,
    mu0,
    muSpeedDecay,
    jerk: 80,
    aebTargetG: 0.95,
    headwind_mps: headwind_mps ?? 0,
    waterFilm_mm: waterFilm_mm ?? 0,
    tirePressure_psi: tirePressure_psi ?? 35,
    treadDepth_mm: treadDepth_mm ?? 6
  };
}


export function clamp(x:number, a:number, b:number){ return Math.max(a, Math.min(b, x)); }
export function kph2mps(k:number){ return k/3.6; }
export function mps2mph(v:number){ return v*2.23693629; }

export function stepLongitudinal(
  v: number, aCmdPrev: number, dt: number, p: PhysParams, brakeOn: boolean
) {
  const g = 9.81;

  // --- Robust params / defaults ---
  const m      = Math.max(1, Number.isFinite(p.m) ? p.m : 1500);
  const rho    = Number.isFinite(p.rho) ? p.rho : 1.225;
  const CdA    = Number.isFinite(p.CdA) ? p.CdA : 0.65;
  const Crr    = Number.isFinite(p.Crr) ? p.Crr : 0.012;
  const grade  = Number.isFinite(p.grade) ? p.grade : 0;
  const mu0    = Number.isFinite(p.mu0) ? p.mu0 : 0.85;
  const muDec  = Number.isFinite(p.muSpeedDecay) ? p.muSpeedDecay : 0.1;
  const aebG   = Number.isFinite(p.aebTargetG) ? p.aebTargetG : 0.95;
  const jerk   = Math.max(1, Number.isFinite(p.jerk) ? p.jerk : 80);

  const headwind       = Number.isFinite(p.headwind_mps) ? p.headwind_mps : 0;
  const waterFilm_mm   = Number.isFinite(p.waterFilm_mm) ? p.waterFilm_mm : 0;
  const tirePsi        = Number.isFinite(p.tirePressure_psi) ? p.tirePressure_psi : 35;
  const tread_mm       = Number.isFinite(p.treadDepth_mm) ? p.treadDepth_mm : 6;

  // --- Friction model (speed loss + wet factor) ---
  let muEff = clamp(mu0 * (1 - muDec * (v / 30)), 0.05, 1.1);
  muEff *= waterMuFactor(v, waterFilm_mm, tirePsi, tread_mm);
  muEff = clamp(muEff, 0.05, 1.1);
  const aMax = muEff * g;

  // --- AEB target decel; capped by traction limit ---
  const aTarget = brakeOn ? -Math.min(aebG * g, aMax) : 0;

  // --- Jerk-limited command (faster to apply brakes, gentler to release) ---
  const jerkApply   = jerk * 1.0;  // toward more negative (apply brake)
  const jerkRelease = jerk * 0.6;  // toward zero (release brake)
  let aCmdNext = aCmdPrev;
  if (aTarget < aCmdPrev) {
    aCmdNext = Math.max(aTarget, aCmdPrev - jerkApply * dt);
  } else if (aTarget > aCmdPrev) {
    aCmdNext = Math.min(aTarget, aCmdPrev + jerkRelease * dt);
  }

  // --- Resistance accelerations helper ---
  const resAccel = (vel: number) => {
    const v_air = Math.max(0, vel + headwind);
    const aDrag  = (0.5 * rho * CdA * v_air * v_air) / m;      // always opposing motion
    const aRoll  = Crr * g * Math.cos(grade);                  // opposes motion
    const aGrade = g * Math.sin(grade);                        // downhill positive
    const aRes   = -(aDrag + aRoll + aGrade);                  // total resisting accel
    return { aDrag, aRoll, aGrade, aRes };
  };

  // --- Heun / RK2 averaging for resistance (better than plain Euler) ---
  const r0 = resAccel(v);
  const vPredict = Math.max(0, v + (aCmdNext + r0.aRes) * dt);
  const r1 = resAccel(vPredict);
  const aResAvg = 0.5 * (r0.aRes + r1.aRes);

  // --- Integrate velocity, clamp & “stick” near zero to avoid chatter ---
  let vNext = v + (aCmdNext + aResAvg) * dt;
  if (vNext < 0.05 && (aCmdNext + aResAvg) < 0) {
    vNext = 0;
    aCmdNext = 0; // stop commanding negative accel when already at rest
  }
  vNext = Math.max(0, vNext);

  return {
    vNext,
    aCmdNext,
    muEff,
    aMax,
    // optional debug fields (safe to ignore by callers)
    aRes: aResAvg,
    aDrag: r0.aDrag,
    aRoll: r0.aRoll,
    aGrade: r0.aGrade,
  };
}

