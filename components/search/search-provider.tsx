"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
