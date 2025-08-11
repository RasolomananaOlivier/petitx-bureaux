import React from "react";

type Props = {};

export default function LocationsSection({}: Props) {
  const links1 = [
    "Espaces de coworking à Paris",
    "Location de bureaux à Paris",
    "Espaces de coworking à Paris 1",
    "Espaces de coworking à Paris 2",
    "Espaces de coworking à Paris 3",
    "Espaces de coworking à Paris 4",
    "Espaces de coworking à Paris 5",
    "Espaces de coworking à Paris 6",
    "Espaces de coworking à Paris 7",
  ];

  const links2 = [
    "Espaces de coworking à Paris 8",
    "Espaces de coworking à Paris 9",
    "Espaces de coworking à Paris 10",
    "Espaces de coworking à Paris 11",
    "Espaces de coworking à Paris 12",
    "Espaces de coworking à Paris 13",
    "Espaces de coworking à Paris 14",
    "Espaces de coworking à Paris 15",
    "Espaces de coworking à Paris 16",
  ];

  const links3 = [
    "Espaces de coworking à Paris 17",
    "Espaces de coworking à Paris 18",
    "Espaces de coworking à Paris 19",
    "Espaces de coworking à Paris 20",
    "Espaces de coworking à Lyon",
    "Espaces de coworking à Bordeaux",
    "Espaces de coworking à Marseille",
    "Espaces de coworking à Nantes",
    "Espaces de coworking à Toulouse",
  ];

  const renderLinks = (links: string[]) => (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href="#"
            className="text-gray-800 hover:text-blue-600 hover:underline"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex items-center justify-center py-16 bg-white">
      <div className="w-full max-w-7xl px-4 md:px-10 mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 font-roslindale">
          Ubiq vous accompagne partout
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
