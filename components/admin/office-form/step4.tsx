"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, AlertCircle } from "lucide-react";
import { useOfficeFormStore } from "@/lib/store/office-store";

interface Step4Props {
  form: any;
}

export default function Step4({ form }: Step4Props) {
  const {
    updateFormData,
    formData: { photos },
  } = useOfficeFormStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }));

    const newPhotos = [...photos, ...newFiles];
    form.setValue("photos", newPhotos);
    updateFormData({
      photos: newPhotos,
    });
  }, []);

  const removeFile = (fileId: string) => {
    const updated = photos.filter((file) => file.id !== fileId);
    form.setValue("photos", updated);
    updateFormData({
      photos: updated,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const photoCount = photos.length;
  const isValid = photoCount >= 4;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload de médias</CardTitle>
          <CardDescription>
            Glissez-déposez vos images ou cliquez pour sélectionner.{" "}
            <span className="font-medium text-blue-600">
              Minimum 4 photos requises.
            </span>
            <br />
            <span className="text-sm text-gray-500">
              Photos uploadées: {photoCount}/4
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Déposez les fichiers ici...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Glissez-déposez vos images ici, ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-gray-400">
                  Formats supportés: JPEG, PNG, WebP (max. 5MB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {form.formState.errors.photos && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {form.formState.errors.photos.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4 grid grid-cols-3 gap-4">
        {photos.map(({ file, id }) => {
          const previewUrl = URL.createObjectURL(file);
          return (
            <div key={id} className="relative border rounded overflow-hidden">
              <img
                src={previewUrl}
                alt={file.name}
                className="object-cover w-full h-32"
                onLoad={() => URL.revokeObjectURL(previewUrl)}
              />
              <button
                onClick={() => removeFile(id)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
