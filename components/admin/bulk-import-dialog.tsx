"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  bulkImportOffices,
  type BulkImportOffice,
} from "@/lib/api/admin-offices";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  parseCSV,
  validateCSVHeaders,
  type CSVRow,
} from "@/lib/utils/csv-utils";

interface BulkImportDialogProps {
  onImportComplete?: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateAndTransformRow(
  row: CSVRow,
  rowIndex: number
): BulkImportOffice | null {
  const errors: string[] = [];

  if (!row.title?.trim()) {
    errors.push("Title is required");
  }

  if (!row.slug?.trim()) {
    errors.push("Slug is required");
  }

  const arr = parseInt(row.arr);
  console.log("arr", row);
  if (isNaN(arr) || arr < 1 || arr > 20) {
    errors.push("Arrondissement must be between 1 and 20");
  }

  const priceCents = parseInt(row.priceCents);
  if (isNaN(priceCents) || priceCents < 0) {
    errors.push("Price must be a positive number");
  }

  const nbPosts = row.nbPosts ? parseInt(row.nbPosts) : 1;
  if (isNaN(nbPosts) || nbPosts < 1) {
    errors.push("Number of posts must be at least 1");
  }

  const lat = parseFloat(row.lat);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push("Latitude must be between -90 and 90");
  }

  const lng = parseFloat(row.lng);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    errors.push("Longitude must be between -180 and 180");
  }

  if (errors.length > 0) {
    throw new Error(`Row ${rowIndex + 1}: ${errors.join(", ")}`);
  }

  const amenities = row.amenities
    ? row.amenities
        .split(";")
        .map((a) => a.trim())
        .filter(Boolean)
    : [];

  return {
    title: row.title.trim(),
    description: row.description?.trim() || "",
    slug: row.slug.trim(),
    arr,
    priceCents,
    nbPosts,
    lat,
    lng,
    isFake: row.isFake?.toLowerCase() === "true",
    amenities,
  };
}

export function BulkImportDialog({ onImportComplete }: BulkImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{
    total: number;
    valid: number;
    errors: string[];
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setFile(file);
    setPreview(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const rows = parseCSV(csvText);

        if (rows.length > 500) {
          toast.error("Maximum 500 rows allowed");
          return;
        }

        const errors: string[] = [];
        let validCount = 0;

        rows.forEach((row, index) => {
          try {
            validateAndTransformRow(row, index);
            validCount++;
          } catch (error) {
            errors.push(
              error instanceof Error ? error.message : "Unknown error"
            );
          }
        });

        setPreview({
          total: rows.length,
          valid: validCount,
          errors,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Invalid CSV format"
        );
      }
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  const handleImport = async () => {
    if (!file || !preview) return;

    setLoading(true);

    try {
      const csvText = await file.text();
      const rows = parseCSV(csvText);
      const offices: BulkImportOffice[] = [];

      rows.forEach((row, index) => {
        try {
          const office = validateAndTransformRow(row, index);
          if (office) {
            offices.push(office);
          }
        } catch (error) {
          console.error(`Row ${index + 1} validation error:`, error);
        }
      });

      const response = await bulkImportOffices(offices);

      if (response.success) {
        toast.success(response.message);
        setOpen(false);
        setFile(null);
        setPreview(null);
        onImportComplete?.();
      } else {
        toast.error("Import failed");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Error during import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import en masse des bureaux</DialogTitle>
          <DialogDescription>
            Importez jusqu'à 500 bureaux depuis un fichier CSV
          </DialogDescription>
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open("/api/admin/offices/template", "_blank")
              }
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger le modèle
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? "Déposez le fichier ici..."
                : "Glissez-déposez un fichier CSV ou cliquez pour sélectionner"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Format attendu:
              title,description,slug,arr,priceCents,nbPosts,lat,lng,isFake,amenities
            </p>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          {preview && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {preview.valid} sur {preview.total} lignes valides
                </span>
              </div>

              {preview.errors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="text-sm">
                      <p className="font-medium mb-2">Erreurs détectées:</p>
                      <ul className="space-y-1 max-h-32 overflow-y-auto">
                        {preview.errors.slice(0, 10).map((error, index) => (
                          <li key={index} className="text-xs text-red-600">
                            {error}
                          </li>
                        ))}
                        {preview.errors.length > 10 && (
                          <li className="text-xs text-gray-500">
                            ... et {preview.errors.length - 10} autres erreurs
                          </li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || !preview || preview.valid === 0 || loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Importer ({preview?.valid || 0} bureaux)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
