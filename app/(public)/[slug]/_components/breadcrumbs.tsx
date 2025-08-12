import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Office {
  title: string
  workstations: number
  surface: number
}

interface BreadcrumbsProps {
  office: Office
}

export function Breadcrumbs({ office }: BreadcrumbsProps) {
  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Location bureaux Paris', href: '/search' },
    { label: 'Location bureaux Paris 2', href: '/search?arrondissement=2' },
    { 
      label: `${office.title} - 75002 - ${office.workstations} postes - ${office.surface}m²`,
      href: '#',
      current: true
    }
  ]

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {breadcrumb.current ? (
            <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
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
  )
}
