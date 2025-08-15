"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormTitle() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 mb-6 lg:mb-8">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeftIcon className="w-4 h-4" />
      </Button>
      <h2 className="text-2xl font-semibold">Contactez-nous pour une visite</h2>
    </div>
  );
}
