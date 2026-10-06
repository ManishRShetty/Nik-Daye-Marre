// src/lib/constants.ts

// These map to [x, y, z] coordinates in your React Three Fiber scene
// X = left/right, Y = up/down (height), Z = forward/backward
export const LOCATIONS = {
  ADMIN_BLOCK: [0, 0, 0],       
  LAB_3: [12, 0, -4],           
  LIBRARY: [-15, 0, 10],        
  CAFETARIA: [5, 0, 20],        
  MAIN_GATE: [0, 0, 30],        
  HOSTEL_A: [-20, 0, -15],      
} as const;

export type LocationId = keyof typeof LOCATIONS;
