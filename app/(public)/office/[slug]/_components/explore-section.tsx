import Link from "next/link";

export function ExploreSection() {
  const arrondissements = Array.from({ length: 20 }, (_, i) => i + 1);

  const neighborhoods = [
    "Châtelet Les Halles",
    "Madeleine",
    "Montparnasse",
    "Bastille",
    "La Défense",
    "Champs Élysées",
    "Opéra",
    "Saint-Lazare",
    "Gare de Lyon",
    "Gare du Nord",
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        Explorer d'autres locations de bureaux et coworkings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            NOS BUREAUX À LOUER PAR ARRONDISSEMENT
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {arrondissements.map((arr) => (
              <Link
                key={arr}
                href={`/bureaux-paris-${arr}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Location bureaux Paris {arr}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            NOS BUREAUX À LOUER PAR QUARTIER ET VILLES
          </h3>
          <div className="space-y-2">
            {neighborhoods.map((neighborhood) => (
              <Link
                key={neighborhood}
                href={`/search?quartier=${neighborhood
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Location bureaux {neighborhood}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            NOS ESPACES DE COWORKING
          </h3>
          <div className="space-y-2">
            <Link
              href="/bureaux-paris-2"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Coworking Paris 2
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
