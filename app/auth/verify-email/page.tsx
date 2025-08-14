"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { authApi, type VerificationResponse } from "@/lib/api/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");
  const [leadData, setLeadData] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setMessage("Token de vérification manquant");
      return;
    }

    const verifyEmail = async () => {
      try {
        const data = await authApi.verifyEmail(token);

        if (data.success) {
          setVerificationStatus("success");
          setMessage(data.message);
          if (data.lead) {
            setLeadData({
              name: data.lead.name,
              email: data.lead.email,
            });
          }
        } else {
          setVerificationStatus("error");
          setMessage(data.error || "Erreur lors de la vérification");
        }
      } catch (error) {
        setVerificationStatus("error");
        setMessage("Erreur de connexion. Veuillez réessayer.");
      }
    };

    verifyEmail();
  }, [token]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">
              Vérification en cours...
            </h2>
            <p className="text-muted-foreground">
              Nous vérifions votre adresse email. Veuillez patienter.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2">
              Email vérifié avec succès !
            </h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            {leadData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  <strong>Nom:</strong> {leadData.name}
                  <br />
                  <strong>Email:</strong> {leadData.email}
                </p>
              </div>
            )}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Notre équipe va vous contacter dans les plus brefs délais pour
                discuter de votre demande.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <Button>Retour à l'accueil</Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline">Voir nos bureaux</Button>
                </Link>
              </div>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold mb-2">
              Erreur de vérification
            </h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Le lien de vérification peut être expiré ou invalide. Veuillez
                contacter notre équipe si vous avez des questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <Button>Retour à l'accueil</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Nous contacter</Button>
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">PetitsBureaux</h1>
          <p className="mt-2 text-sm text-gray-600">
            Vérification de votre adresse email
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Confirmation d'email</CardTitle>
            <CardDescription className="text-center">
              Vérification de votre demande de bureau
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">PetitsBureaux</h1>
          <p className="mt-2 text-sm text-gray-600">
            Vérification de votre adresse email
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Confirmation d'email</CardTitle>
            <CardDescription className="text-center">
              Vérification de votre demande de bureau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <h2 className="text-xl font-semibold mb-2">Chargement...</h2>
              <p className="text-muted-foreground">
                Veuillez patienter pendant le chargement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
