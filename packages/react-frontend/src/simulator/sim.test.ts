/// <reference types="jest" />

import {
  clamp,
  kph2mps,
  mps2mph,
  pickPhysParamsFromEnv,
  stepLongitudinal,
  type PhysParams,
} from "./physics";

describe("clamp()", () => {
  test("returns x when in range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test("clamps below lower bound", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test("clamps above upper bound", () => {
    expect(clamp(20, 0, 10)).toBe(10);
  });
});

describe("speed conversion helpers", () => {
  test("kph2mps converts 36 km/h → 10 m/s", () => {
    const got = kph2mps(36);
    expect(got).toBeCloseTo(10, 5);
  });

  test("mps2mph converts 0 → 0", () => {
    expect(mps2mph(0)).toBe(0);
  });

  test("mps2mph converts 1 m/s to ≈ 2.2369 mph", () => {
    const got = mps2mph(1);
    expect(got).toBeCloseTo(2.2369, 4);
  });
});

describe("pickPhysParamsFromEnv()", () => {
  test("returns reasonable defaults for clear asphalt", () => {
    const phys = pickPhysParamsFromEnv("clear", "asphalt");

    expect(phys.m).toBeGreaterThan(0);
    expect(phys.rho).toBeGreaterThan(0);
    expect(phys.CdA).toBeGreaterThan(0);
    expect(phys.Crr).toBeGreaterThan(0);
    expect(phys.mu0).toBeGreaterThan(0);
  });

  test("rain reduces mu0 and increases rolling resistance on asphalt", () => {
    const dry = pickPhysParamsFromEnv("clear", "asphalt");
    const rain = pickPhysParamsFromEnv("raining", "asphalt");

    // Same vehicle / geometry
    expect(dry.m).toBe(rain.m);
    expect(dry.CdA).toBeCloseTo(rain.CdA);

    // Wet road should be more slippery and have higher rolling drag
    expect(rain.mu0).toBeLessThan(dry.mu0);
    expect(rain.Crr).toBeGreaterThan(dry.Crr);
  });
});

describe("stepLongitudinal()", () => {
  function makeBasePhys(): PhysParams {
    // Use the same helper as the sim
    return pickPhysParamsFromEnv("clear", "asphalt");
  }

  test("never produces negative speeds", () => {
    const phys = makeBasePhys();
    const res = stepLongitudinal(10, 0, 0.1, phys, false);
    expect(res.vNext).toBeGreaterThanOrEqual(0);
  });

  test("braking reduces speed compared to coasting", () => {
    const phys = makeBasePhys();
    const v0 = 30;

    const resCoast = stepLongitudinal(v0, 0, 1.0, phys, false);
    const resBrake = stepLongitudinal(v0, 0, 1.0, phys, true);

    // Both non-negative
    expect(resCoast.vNext).toBeGreaterThanOrEqual(0);
    expect(resBrake.vNext).toBeGreaterThanOrEqual(0);

    // Braking should slow more than coasting
    expect(resBrake.vNext).toBeLessThan(v0);
    expect(resBrake.vNext).toBeLessThan(resCoast.vNext);
  });

  test("stopped vehicle stays essentially stopped under braking", () => {
    const phys = makeBasePhys();
    const res = stepLongitudinal(0, 0, 1.0, phys, true);

    expect(res.vNext).toBeGreaterThanOrEqual(0);
    // Because of the "stick near zero" logic, it should be clamped very close to 0
    expect(res.vNext).toBeLessThanOrEqual(0.05);
  });
});
