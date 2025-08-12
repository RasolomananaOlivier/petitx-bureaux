"use client";

import { useState } from "react";
import Image from "next/image";

interface OfficeGalleryProps {
  images: string[];
}

export function OfficeGallery({ images }: OfficeGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1 aspect-video relative overflow-hidden rounded-lg">
        <Image
          src={images[0]}
          alt="Office space"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="col-span-1 grid grid-cols-2 gap-4">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={index}
            className={`w-full aspect-video relative overflow-hidden rounded-md transition-all ${"hover:opacity-80"}`}
          >
            <Image
              src={image}
              alt={`Office thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
