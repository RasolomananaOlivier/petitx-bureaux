"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building, Users, BarChart3, Home, Settings } from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    name: "Bureaux",
    href: "/admin/offices",
    icon: Building,
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white">
      <div className="flex items-center  h-16 px-4">
        <div className="flex items-center space-x-3">
          {/* Logo Icon */}
          <div className="relative">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
          </div>
          {/* Brand Text */}
          <div className="text-blue-950">
            <h1 className="text-lg font-bold leading-tight">Petites Bureaux</h1>
            <p className="text-xs text-blue-600 opacity-90">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t">
        <Link
          href="/admin/settings"
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900"
        >
          <Settings className="w-5 h-5 mr-3" />
          Paramètres
        </Link>
      </div>
    </div>
  );
}
