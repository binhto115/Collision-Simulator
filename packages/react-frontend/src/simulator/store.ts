import { create } from "zustand";

// Parameters that the physics actually uses for the three cars
export type VehicleParams = {
  // Masses
  mE: number;
  m1: number;
  m2: number;

  // Drag area
  CdAE: number;
  CdA1: number;
  CdA2: number;

  // Vehicle lengths
  lenE: number;
  len1: number;
  len2: number;
};

// Road and condition parameters used by the simulator
export type RoadParams = {
  surface: "asphalt" | "concrete" | "gravel" | "ice";
  waterFilm_mm: number;
  tirePressure_psi: number;
  treadDepth_mm: number;
  airTempC: number;
  altitude_m: number;
  headwind_mps: number;
  surfaceRoughness: number;
};

type SimStore = {
  vehicle: VehicleParams;
  road: RoadParams;
  setVehicle: (patch: Partial<VehicleParams>) => void;
  setRoad: (patch: Partial<RoadParams>) => void;
};

export const useSimStore = create<SimStore>((set) => ({
  vehicle: {
    mE: 1500,
    m1: 1500,
    m2: 1500,
    CdAE: 0.65,
    CdA1: 0.65,
    CdA2: 0.65,
    lenE: 4.5,
    len1: 4.5,
    len2: 4.5,
  },
  road: {
    surface: "asphalt",
    waterFilm_mm: 0,
    tirePressure_psi: 35,
    treadDepth_mm: 6,
    airTempC: 20,
    altitude_m: 0,
    headwind_mps: 0,
    surfaceRoughness: 0.3,
  },
  setVehicle: (patch) =>
    set((state) => ({ vehicle: { ...state.vehicle, ...patch } })),
  setRoad: (patch) =>
    set((state) => ({ road: { ...state.road, ...patch } })),
}));
