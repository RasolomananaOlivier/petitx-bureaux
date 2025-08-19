import { Coordinates } from "@/types/types";
import { ARRONDISSEMENT_BOUNDARIES } from "./arrondissement-boundaries";

export const PARIS_CENTER: Coordinates = { lat: 48.8566, lng: 2.3522 };
export const MAP_ID = "8bd9c5116791156d9b61917d";

export const ARRONDISSEMENT_CENTERS: Record<number, Coordinates> = {
  1: { lat: 48.8566, lng: 2.3522 },
  2: { lat: 48.8674, lng: 2.3414 },
  3: { lat: 48.8606, lng: 2.3622 },
  4: { lat: 48.8559, lng: 2.3622 },
  5: { lat: 48.8447, lng: 2.3431 },
  6: { lat: 48.8509, lng: 2.3324 },
  7: { lat: 48.8566, lng: 2.3132 },
  8: { lat: 48.8698, lng: 2.3077 },
  9: { lat: 48.8747, lng: 2.3376 },
  10: { lat: 48.8769, lng: 2.3594 },
  11: { lat: 48.8634, lng: 2.3707 },
  12: { lat: 48.8404, lng: 2.3955 },
  13: { lat: 48.8324, lng: 2.3562 },
  14: { lat: 48.8331, lng: 2.3264 },
  15: { lat: 48.8417, lng: 2.2897 },
  16: { lat: 48.8647, lng: 2.2758 },
  17: { lat: 48.8876, lng: 2.3077 },
  18: { lat: 48.8927, lng: 2.3444 },
  19: { lat: 48.8807, lng: 2.3824 },
  20: { lat: 48.8634, lng: 2.3984 },
};

export const ARRONDISSEMENT_ZOOM_LEVELS: Record<number, number> = {
  1: 16,
  2: 16,
  3: 16,
  4: 16,
  5: 16,
  6: 16,
  7: 16,
  8: 16,
  9: 16,
  10: 16,
  11: 15,
  12: 15,
  13: 15,
  14: 15,
  15: 15,
  16: 15,
  17: 15,
  18: 15,
  19: 15,
  20: 15,
};

export { ARRONDISSEMENT_BOUNDARIES };
