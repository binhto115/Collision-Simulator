import { create } from "zustand";

type Vehicle = { name:string; mass:number; length:number; CdA:number; }
type Driver  = { reaction:number; headway:number; brakeGain:number; distractProb:number; }
type Env     = { weather:"clear"|"raining"|"snowing"|"fog"; surface:"dry"|"wet"|"snow"|"ice"; rho:number; Crr:number; }
type Road    = { grade_deg:number; lanes:number; radius:number; }

type SimStore = {
  vehicle: Vehicle; setVehicle:(p:Partial<Vehicle>)=>void;
  driver:  Driver;  setDriver:(p:Partial<Driver>)=>void;
  env:     Env;     setEnv:(p:Partial<Env>)=>void;
  road:    Road;    setRoad:(p:Partial<Road>)=>void;
};

export const useSimStore = create<SimStore>((set)=>({
  vehicle:{ name:"Generic car", mass:1500, length:4.5, CdA:0.65 },
  driver:{  reaction:1.0, headway:1.6, brakeGain:1.0, distractProb:0 },
  env:{     weather:"clear", surface:"dry", rho:1.225, Crr:0.012 },
  road:{    grade_deg:0, lanes:2, radius:500 },

  setVehicle:(p)=>set(s=>({ vehicle:{ ...s.vehicle, ...p } })),
  setDriver:(p)=>set(s=>({  driver:{ ...s.driver,  ...p } })),
  setEnv:(p)=>set(s=>({     env:{    ...s.env,     ...p } })),
  setRoad:(p)=>set(s=>({    road:{   ...s.road,    ...p } })),
}));
