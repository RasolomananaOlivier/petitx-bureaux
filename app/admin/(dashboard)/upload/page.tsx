"use client";

import { useState } from "react";
import { MediaUpload } from "@/components/admin/media-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image, Folder } from "lucide-react";

export default function MediaUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleUploadSuccess = (fileUrl: string) => {
    setUploadedFiles((prev) => [...prev, fileUrl]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Médias</h1>
        <p className="text-gray-600">Upload et optimisation des photos</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center">
            <Image className="w-4 h-4 mr-2" />
            Galerie
          </TabsTrigger>
          <TabsTrigger value="folders" className="flex items-center">
            <Folder className="w-4 h-4 mr-2" />
            Dossiers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div className="grid gap-6 md:grid-cols-2">
            <MediaUpload onUploadSuccess={handleUploadSuccess} />

            <Card>
              <CardHeader>
                <CardTitle>Bonnes pratiques</CardTitle>
                <CardDescription>
                  Conseils pour des photos optimales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Formats recommandés</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• JPEG pour les photos de bureaux</li>
                    <li>• WebP pour une meilleure compression</li>
                    <li>• PNG pour les logos avec transparence</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Dimensions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 1200x800px minimum</li>
                    <li>• Ratio 3:2 ou 4:3 recommandé</li>
                    <li>• Taille max: 5MB par fichier</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Optimisation</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Compression automatique activée</li>
                    <li>• Génération de thumbnails</li>
                    <li>• CDN pour la diffusion rapide</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Galerie des médias</CardTitle>
              <CardDescription>
                Toutes les images uploadées ({uploadedFiles.length} fichiers)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="text-gray-500 text-sm">
                      Image {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folders">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Bureaux Marais", count: 24, updated: "2024-02-10" },
              {
                name: "Bureaux Montparnasse",
                count: 18,
                updated: "2024-02-09",
              },
              { name: "Bureaux République", count: 31, updated: "2024-02-08" },
              { name: "Photos génériques", count: 12, updated: "2024-02-05" },
              { name: "Logos partenaires", count: 8, updated: "2024-01-30" },
              { name: "Assets marketing", count: 15, updated: "2024-01-28" },
            ].map((folder, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Folder className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{folder.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {folder.count} fichiers
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Modifié le {folder.updated}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
