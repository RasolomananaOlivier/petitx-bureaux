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
import { Upload, X } from "lucide-react";

interface MediaUploadProps {
  onUploadSuccess?: (fileUrl: string) => void;
}

interface UploadFile {
  file: File;
  id: string;
}

export function MediaUpload({}: MediaUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }));

    setUploadFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload de médias</CardTitle>
          <CardDescription>
            Glissez-déposez vos images ou cliquez pour sélectionner
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

      <div className="mt-4 grid grid-cols-3 gap-4">
        {uploadFiles.map(({ file, id }) => {
          const previewUrl = URL.createObjectURL(file);
          return (
            <div key={id} className="relative border rounded overflow-hidden">
              <img
                src={previewUrl}
                alt={file.name}
                className="object-cover w-full h-32"
                onLoad={() => URL.revokeObjectURL(previewUrl)} // free memory
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
