import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import React from "react";

type Props = {
  text: string;
  className?: string;
};

export default function PostsBadge({ text, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-primary font-medium text-sm bg-blue-50 w-max px-1 py-1 rounded-sm",
        className
      )}
    >
      <Users className="size-3.5" />
      <span>{text}</span>
    </div>
  );
}
