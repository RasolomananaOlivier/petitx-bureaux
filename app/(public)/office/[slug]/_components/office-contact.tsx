import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface Contact {
  name: string;
  avatar: string;
  partnerSince: number;
  responseTime: string;
  responseRate: number;
}

interface OfficeContactProps {
  contact: Contact;
  officeId: number;
}

export function OfficeContact({ contact, officeId }: OfficeContactProps) {
  return (
    <div className="space-y-8">
      <Card className="border-gray-200 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="size-16 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 font-semibold text-lg">
                  {contact.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-gray-900">{contact.name}</h4>
              <p className="text-sm text-gray-600">
                Partenaire depuis {contact.partnerSince}
              </p>
              <p className="text-sm text-gray-600">
                Répond en {contact.responseTime}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center gap-4 flex-col">
            <h2 className="text-xl font-bold text-gray-900 text-center">
              Cette annonce vous intéresse ?
            </h2>
            <Button
              asChild
              className="w-full bg-primary font-bold text-white py-6"
            >
              <Link href={`/lead?officeId=${officeId}`}>Contacter</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-600 text-center">
        Dernier mise à jour le 12/08/2025
      </div>

      <div className="bg-gray-50 border border-blue-400 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="font-semibold text-gray-900">Petits Bureaux</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">accès à 100% de l'offre</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">meilleurs prix</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">service gratuit</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < 4 ? "text-green-500 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900">4.5 sur 5</span>
          <span className="text-xs text-gray-500">Trustpilot</span>
        </div>
      </div>
    </div>
  );
}
