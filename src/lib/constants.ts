// src/lib/constants.ts

// These map to [x, y, z] coordinates in your React Three Fiber scene
// X = left/right, Y = up/down (height), Z = forward/backward
export const LOCATIONS = {
  ADMIN_BLOCK: [-10, 16, -10], // On top of the [-10, 8, -10] building
  LAB_3: [0, 8, -30],          // On top of the [0, 4, -30] building
  LIBRARY: [-15, 12, 10],      // On top of the cylinder building
  CAFETARIA: [20, 16, 15],     // On top of the [20, 8, 15] building
  MAIN_GATE: [0, 0, 30],       // Front of the floor
  HOSTEL_A: [10, 10, -20],     // On top of the [10, 5, -20] building
} as const;

export type LocationId = keyof typeof LOCATIONS;
