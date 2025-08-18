import * as React from "react";
import Link from "next/link";
import { type OfficeWithRelations } from "@/features/offices/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      label: `Paris ${office.arr}`,
      href: `/search?arr=${office.arr}`,
    },
    {
      label: `${office.title} - 7500${office.arr} - ${workstations} postes - ${surface}m²`,
      href: "#",
      current: true,
    },
  ];

  return (
    <Breadcrumb className="overflow-x-auto pb-2 sm:pb-0">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {breadcrumb.current ? (
                <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-none">
                  {breadcrumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={breadcrumb.href}
                    className="truncate max-w-[150px] sm:max-w-none"
                  >
                    {breadcrumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
