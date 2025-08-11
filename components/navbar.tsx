"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, Search, User, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type Props = Record<string, never>;

export default function Navbar({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <nav className="w-full flex justify-center h-16 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-4 md:px-5 text-sm">
        <div className="flex gap-3 md:gap-5 items-center font-semibold">
          <Link
            href="/"
            className="text-lg md:text-xl font-bold font-roslindale"
          >
            Petits Bureaux
          </Link>
          <Button
            variant="ghost"
            className="font-light px-2 md:px-0 hover:bg-transparent hover:text-blue-500 text-xs min-h-[44px] hidden md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="ml-1">RECHERCHER</span>
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-3 lg:gap-5 text-xs">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
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
            className="font-light px-2 md:px-0 hover:bg-transparent hover:text-blue-500 text-xs min-h-[44px]"
          >
            NOTRE OFFRE
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="ghost"
            className="font-light px-2 md:px-0 hover:bg-transparent hover:text-blue-500 text-xs min-h-[44px]"
          >
            CRÉER UNE ANNONCE
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="ghost"
            className="font-light px-2 md:px-0 hover:bg-transparent hover:text-blue-500 text-xs min-h-[44px]"
          >
            AIDE & CONTACT
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>

          <Button
            variant="ghost"
            className="font-light px-2 md:px-0 hover:bg-transparent hover:text-blue-500 text-xs min-h-[44px]"
          >
            <User className="h-4 w-4" />
            <span className="ml-1">CONNEXION</span>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="!size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left font-roslindale text-xl">
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              <Button
                variant="ghost"
                className="justify-start font-light hover:bg-transparent hover:text-blue-500 text-sm min-h-[44px] px-4 py-2"
                onClick={handleClose}
              >
                <Search className="h-4 w-4 mr-3" />
                RECHERCHER
              </Button>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-muted-foreground">
                    APPELER UBQ
                  </div>
                  <div className="font-bold text-sm">+33 1 23 45 67 89</div>
                </div>
              </div>

              <Button
                variant="ghost"
                className="justify-start font-light hover:bg-transparent hover:text-blue-500 text-sm min-h-[44px] px-4 py-2"
                onClick={handleClose}
              >
                NOTRE OFFRE
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>

              <Button
                variant="ghost"
                className="justify-start font-light hover:bg-transparent hover:text-blue-500 text-sm min-h-[44px] px-4 py-2"
                onClick={handleClose}
              >
                CRÉER UNE ANNONCE
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>

              <Button
                variant="ghost"
                className="justify-start font-light hover:bg-transparent hover:text-blue-500 text-sm min-h-[44px] px-4 py-2"
                onClick={handleClose}
              >
                AIDE & CONTACT
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>

              <Button
                variant="ghost"
                className="justify-start font-light hover:bg-transparent hover:text-blue-500 text-sm min-h-[44px] px-4 py-2"
                onClick={handleClose}
              >
                <User className="h-4 w-4 mr-3" />
                CONNEXION
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
