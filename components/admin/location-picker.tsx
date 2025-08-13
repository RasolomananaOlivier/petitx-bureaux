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
import { useGeocoder } from "@/hooks/useGeocoder";
import { Coordinates } from "@/lib/types";
import { buildTitleFrom, extractArrondissement } from "@/lib/utils/google-map";
import { MAP_ID, PARIS_CENTER } from "@/lib/utils/constants";

interface LocationPickerProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  latName: FieldPath<TFieldValues>;
  lngName: FieldPath<TFieldValues>;
  titleName: FieldPath<TFieldValues>;
  arrName: FieldPath<TFieldValues>;
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

  const geocode = useGeocoder();

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
      if (!geocode) return;
      geocode({ location: coords }, (results, status) => {
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
        const nextTitle = buildTitleFrom(best.address_components, arr);
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
    [arrName, form, latName, lngName, titleName, geocode]
  );

  const center = useMemo(() => position ?? PARIS_CENTER, [position]);

  return (
    <div className="space-y-3">
      <Map
        mapId={MAP_ID}
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
