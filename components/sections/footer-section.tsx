"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-muted/30 text-muted-foreground">
      <footer className="max-w-7xl mx-auto w-full mt-12 px-4 md:px-12">
        <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Bureaux */}
          <Card className="shadow-none border-0 bg-transparent">
            <CardHeader className="p-0">
              <CardTitle className="text-xs text-gray-500 font-semibold">
                BUREAUX
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-2 text-sm">
              {[
                "Location de bureaux à Paris",
                "Location de bureaux à Lyon",
                "Location de bureaux à Marseille",
                "Location de bureaux à Bordeaux",
              ].map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  className="hover:text-primary transition-colors block"
                >
                  {item}
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Coworking */}
          <Card className="shadow-none border-0 bg-transparent">
            <CardHeader className="p-0">
              <CardTitle className="text-xs text-gray-500 font-semibold">
                TOUS LES ESPACES DE COWORKING
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-2 text-sm">
              {[
                "À propos du coworking",
                "Coworking à Paris",
                "Coworking à Lyon",
                "Coworking à Marseille",
                "Coworking à Bordeaux",
                "Média",
                "Nous rejoindre",
              ].map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  className="hover:text-primary transition-colors block"
                >
                  {item}
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* À propos */}
          <Card className="shadow-none border-0 bg-transparent">
            <CardHeader className="p-0">
              <CardTitle className="text-xs text-gray-500 font-semibold">
                À PROPOS D&apos;UBIQ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-2 text-sm">
              {[
                "L'emplacement idéal pour vos bureaux",
                "Comparateur de contrats",
                "À propos",
                "Louer un bureau : comment ça marche ?",
                "Chercher un bureau : comment ça marche ?",
              ].map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  className="hover:text-primary transition-colors block"
                >
                  {item}
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="shadow-none border-0 bg-transparent">
            <CardHeader className="p-0">
              <CardTitle className="text-xs text-gray-500 font-semibold">
                NOUS CONTACTER
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <Link href="#" className="hover:text-primary">
                  Envoyer un message
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary" />
                <Link href="#" className="hover:text-primary">
                  07 55 54 06 09
                </Link>
              </div>

              <div className="py-2"></div>

              <h4 className="text-xs text-gray-500 font-semibold">
                ABONNEZ-VOUS À NOTRE NEWSLETTER
              </h4>
              <form className="flex flex-col mt-8 space-y-2">
                <Input
                  type="email"
                  placeholder="Adresse email"
                  className="py-6 px-4 bg-white"
                />
                <Button type="submit" className="py-6 px-6 text-base font-bold">
                  S&apos;abonner
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 text-sm pt-6">
          {/* Social */}
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary">
              <Linkedin size={20} />
            </Link>
            <Link href="#" className="hover:text-primary">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="hover:text-primary">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="hover:text-primary">
              <Twitter size={20} />
            </Link>
          </div>

          {/* Trustpilot */}
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm">Excellent</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-xs text-muted-foreground">Trustpilot</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-left text-xs text-muted-foreground pb-16">
          © 2012-2025 Ubiq. Tous droits réservés.{" "}
          <Link href="#" className="hover:underline">
            À propos
          </Link>{" "}
          -
          <Link href="#" className="hover:underline">
            {" "}
            CGU
          </Link>{" "}
          -
          <Link href="#" className="hover:underline">
            {" "}
            Politique
          </Link>
        </div>
      </footer>
    </div>
  );
}
