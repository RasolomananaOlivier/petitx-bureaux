import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowDown, ChevronDown, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="w-full flex justify-center h-16 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="text-xl font-bold font-roslindale">
            Petits Bureaux
          </Link>
          <Button
            variant="ghost"
            className="font-light px-0 hover:bg-transparent hover:text-blue-500 text-xs"
          >
            <Search className="h-4 w-4" />
            RECHERCHER
          </Button>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0.5">
              <div>APPELER UBQ</div>
              <div className="font-bold text-sm">+33 1 23 45 67 89</div>
            </div>
          </div>

          <Button
            variant="ghost"
            className="font-light px-0 hover:bg-transparent hover:text-blue-500 text-xs"
          >
            NOTRE OFFRE
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="font-light px-0 hover:bg-transparent hover:text-blue-500 text-xs"
          >
            CRÉER UNE ANNONCE
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="font-light px-0 hover:bg-transparent hover:text-blue-500 text-xs"
          >
            AIDE & CONTACT
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            className="font-light px-0 hover:bg-transparent hover:text-blue-500 text-xs"
          >
            <User className="h-4 w-4" />
            CONNEXION
          </Button>
        </div>
      </div>
    </nav>
  );
}
