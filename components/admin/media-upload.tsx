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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Check, AlertCircle } from "lucide-react";

interface MediaUploadProps {
  onUploadSuccess: (fileUrl: string) => void;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

export function MediaUpload({ onUploadSuccess }: MediaUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending",
    }));

    setUploadFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload for each file
    newFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id);
    });
  }, []);

  const simulateUpload = async (fileId: string) => {
    const updateFile = (updates: Partial<UploadFile>) => {
      setUploadFiles((prev) =>
        prev.map((file) =>
          file.id === fileId ? { ...file, ...updates } : file
        )
      );
    };

    updateFile({ status: "uploading" });

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      updateFile({ progress });
    }

    // Simulate success or error
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      const mockUrl = `/uploads/${fileId}.jpg`;
      updateFile({
        status: "success",
        url: mockUrl,
        progress: 100,
      });
      onUploadSuccess(mockUrl);
    } else {
      updateFile({
        status: "error",
        error: "Erreur lors du téléchargement",
        progress: 0,
      });
    }
  };

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, status: "pending", progress: 0, error: undefined }
          : file
      )
    );
    simulateUpload(fileId);
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

      {uploadFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fichiers en cours d'upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center space-x-4 p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === "success" && (
                          <Badge variant="default" className="text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Terminé
                          </Badge>
                        )}
                        {uploadFile.status === "error" && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Erreur
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(uploadFile.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {uploadFile.status === "uploading" && (
                      <Progress value={uploadFile.progress} className="h-2" />
                    )}

                    {uploadFile.status === "error" && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-600">
                          {uploadFile.error}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryUpload(uploadFile.id)}
                        >
                          Réessayer
                        </Button>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-1">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
