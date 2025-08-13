"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Map, AdvancedMarker, useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationPickerProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  latName: FieldPath<TFieldValues>;
  lngName: FieldPath<TFieldValues>;
  titleName: FieldPath<TFieldValues>;
  arrName: FieldPath<TFieldValues>;
}

type Coordinates = { lat: number; lng: number };

const PARIS_CENTER: Coordinates = { lat: 48.8566, lng: 2.3522 };

function extractArrondissement(
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

function buildTitle(
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

export default function LocationPicker<TFieldValues extends FieldValues>({
  form,
  latName,
  lngName,
  titleName,
  arrName,
}: LocationPickerProps<TFieldValues>) {
  const lat = useWatch({ control: form.control, name: latName }) as unknown as
    | number
    | undefined;
  const lng = useWatch({ control: form.control, name: lngName }) as unknown as
    | number
    | undefined;
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [reverseAddress, setReverseAddress] = useState<string>("");

  const geocodingLib = useMapsLibrary("geocoding");
  const geocoder = useMemo(
    () => geocodingLib && new geocodingLib.Geocoder(),
    [geocodingLib]
  );

  useEffect(() => {
    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    ) {
      setPosition({ lat, lng });
    }
  }, [lat, lng]);

  const handlePositionChange = useCallback(
    (coords: Coordinates) => {
      setPosition(coords);
      form.setValue(
        latName,
        coords.lat as unknown as FieldPathValue<TFieldValues, typeof latName>,
        { shouldValidate: true, shouldDirty: true }
      );
      form.setValue(
        lngName,
        coords.lng as unknown as FieldPathValue<TFieldValues, typeof lngName>,
        { shouldValidate: true, shouldDirty: true }
      );
      if (!geocoder) return;
      geocoder.geocode({ location: coords }, (results, status) => {
        console.log("results", results);
        if (
          status !== google.maps.GeocoderStatus.OK ||
          !results ||
          results.length === 0
        )
          return;
        const best = results[0];
        setReverseAddress(best.formatted_address);
        const arr = extractArrondissement(best.address_components);
        if (arr)
          form.setValue(
            arrName,
            arr as unknown as FieldPathValue<TFieldValues, typeof arrName>,
            { shouldValidate: true, shouldDirty: true }
          );
        const nextTitle = buildTitle(best.address_components, arr);
        if (nextTitle)
          form.setValue(
            titleName,
            nextTitle as unknown as FieldPathValue<
              TFieldValues,
              typeof titleName
            >,
            { shouldValidate: true, shouldDirty: true }
          );
      });
    },
    [arrName, form, latName, lngName, titleName]
  );

  const center = useMemo(() => position ?? PARIS_CENTER, [position]);

  return (
    <div className="space-y-3">
      <Map
        mapId="8bd9c5116791156d9b61917d"
        defaultZoom={13}
        defaultCenter={center}
        gestureHandling="cooperative"
        disableDefaultUI={true}
        className="w-full h-72 rounded-lg overflow-hidden border"
        onClick={(e) => {
          const c = e.detail.latLng;
          if (!c) return;
          handlePositionChange({ lat: c.lat, lng: c.lng });
        }}
      >
        {position && (
          <AdvancedMarker
            position={position}
            onDragEnd={(e) => {
              const t = (e as unknown as google.maps.MapMouseEvent).latLng;
              if (!t) return;
              handlePositionChange({ lat: t.lat(), lng: t.lng() });
            }}
          />
        )}
      </Map>

      {reverseAddress && (
        <div className="text-sm text-gray-600">{reverseAddress}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lat_picker">Latitude</Label>
          <Input
            id="lat_picker"
            type="number"
            step="any"
            value={position?.lat ?? ""}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v) && position)
                handlePositionChange({ lat: v, lng: position.lng });
            }}
          />
        </div>
        <div>
          <Label htmlFor="lng_picker">Longitude</Label>
          <Input
            id="lng_picker"
            type="number"
            step="any"
            value={position?.lng ?? ""}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v) && position)
                handlePositionChange({ lat: position.lat, lng: v });
            }}
          />
        </div>
      </div>
    </div>
  );
}
