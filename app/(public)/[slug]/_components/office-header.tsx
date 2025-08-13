import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfficeHeaderProps {
  title: string;
  workstations: number;
  surface: number;
  price: number;
  currency: string;
  period: string;
  availability: string;
}

export function OfficeHeader({
  title,
  workstations,
  surface,
  price,
  currency,
  period,
  availability,
}: OfficeHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="space-y-1 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center items-start justify-between w-full text-[22px] font-bold text-gray-900">
          <h1 className="  ">{title}</h1>
          <div className="hidden lg:flex text-right gap-2">
            <div className=" ">
              {price.toLocaleString()} {currency}
            </div>
            <div className="text-sm text-gray-600 font-normal pt-0.5">
              {period}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <span>
            {workstations} postes - {surface} m²
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-sm font-medium text-green-600">
            {availability}
          </span>
          <span className="relative flex size-2 ml-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-green-500"></span>
          </span>
        </div>

        <div className="flex lg:hidden text-right gap-2 text-[22px] font-bold text-gray-900">
          <div className=" ">
            {price.toLocaleString()} {currency}
          </div>
          <div className="text-sm text-gray-600 font-normal pt-0.5">
            {period}
          </div>
        </div>
      </div>
    </div>
  );
}
