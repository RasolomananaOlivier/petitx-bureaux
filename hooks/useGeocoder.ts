import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

export function useGeocoder() {
  const geocodingLib = useMapsLibrary("geocoding");
  const geocoder = useMemo(
    () => geocodingLib && new geocodingLib.Geocoder(),
    [geocodingLib]
  );

  return geocoder?.geocode;
}
