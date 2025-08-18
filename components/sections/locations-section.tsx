import React from "react";
import Link from "next/link";

type Props = Record<string, never>;

export default function LocationsSection({}: Props) {
  const arrondissements = Array.from({ length: 20 }, (_, i) => i + 1);

  const links1 = [
    { text: "Espaces de coworking à Paris", href: "/search" },
    { text: "Location de bureaux à Paris", href: "/search" },
    ...arrondissements.slice(0, 6).map((num) => ({
      text: `Espaces de coworking à Paris ${num}`,
      href: `/bureaux-paris-${num}`,
    })),
  ];

  const links2 = arrondissements.slice(6, 13).map((num) => ({
    text: `Espaces de coworking à Paris ${num}`,
    href: `/bureaux-paris-${num}`,
  }));

  const links3 = arrondissements.slice(13, 20).map((num) => ({
    text: `Espaces de coworking à Paris ${num}`,
    href: `/bureaux-paris-${num}`,
  }));

  const renderLinks = (links: Array<{ text: string; href: string }>) => (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className="text-gray-800 hover:text-blue-600 hover:underline"
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex items-center justify-center py-16 bg-white">
      <div className="w-full max-w-7xl px-4 md:px-10 mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 font-roslindale">
          Petits Bureaux vous accompagne partout
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <div className="col-span-1">{renderLinks(links1)}</div>
          <div className="col-span-1">{renderLinks(links2)}</div>
          <div className="col-span-1">{renderLinks(links3)}</div>
        </div>
      </div>
    </div>
  );
}
