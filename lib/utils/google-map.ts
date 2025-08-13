export function buildTitleFrom(
  addressComponents: google.maps.GeocoderAddressComponent[],
  arrondissement: number | null
): string | null {
  const route = addressComponents.find((c) =>
    c.types.includes("route")
  )?.long_name;

  const locality = addressComponents.find((c) =>
    c.types.includes("locality")
  )?.long_name;

  if (!route || !locality) return null;

  const arrText = arrondissement ? ` ${arrondissement}` : "";
  return `${route}, ${locality}${arrText}`;
}

export function extractArrondissement(
  addressComponents: google.maps.GeocoderAddressComponent[]
): number | null {
  const sublocality = addressComponents.find((c) =>
    c.types.includes("sublocality_level_1")
  );

  if (sublocality) {
    const match = sublocality.long_name.match(/(\d{1,2})/);
    if (match) return Number(match[1]);
  }

  const postalCode = addressComponents.find((c) =>
    c.types.includes("postal_code")
  )?.long_name;

  if (postalCode && /^750\d{2}$/.test(postalCode)) {
    const n = Number(postalCode.slice(3));
    if (n >= 1 && n <= 20) return n;
  }

  const admin3 = addressComponents.find((c) =>
    c.types.includes("administrative_area_level_3")
  );

  if (admin3) {
    const match = admin3.long_name.match(/(\d{1,2})/);
    if (match) return Number(match[1]);
  }

  return null;
}
