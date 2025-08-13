import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { type OfficeWithRelations } from "@/features/offices/types";

interface BreadcrumbsProps {
  office: OfficeWithRelations;
}

export function Breadcrumbs({ office }: BreadcrumbsProps) {
  const workstations = office.nbPosts || 0;
  const surface = Math.round((office.nbPosts || 1) * 5);

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: "Location bureaux Paris", href: "/search" },
    {
      label: `Location bureaux Paris ${office.arr}`,
      href: `/search?arrondissement=${office.arr}`,
    },
    {
      label: `${office.title} - 7500${office.arr} - ${workstations} postes - ${surface}m²`,
      href: "#",
      current: true,
    },
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {breadcrumb.current ? (
            <span className="text-gray-900 font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="hover:text-blue-600 transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
