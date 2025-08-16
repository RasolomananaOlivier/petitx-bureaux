"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useDuplicateOffice } from "@/hooks/use-duplicate-office";

interface DuplicateOfficeDialogProps {
  officeId: number;
  officeTitle: string;
  trigger?: React.ReactNode;
}

export function DuplicateOfficeDialog({
  officeId,
  officeTitle,
  trigger,
}: DuplicateOfficeDialogProps) {
  const [open, setOpen] = useState(false);
  const duplicateOffice = useDuplicateOffice();

  const handleDuplicate = async () => {
    try {
      await duplicateOffice.mutateAsync(officeId);
      setOpen(false);
    } catch (error) {
      console.error("Error duplicating office:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full">
        {trigger || (
          <Button variant="ghost" size="default" className="justify-start px-2">
            <Copy className="mr-2 h-4 w-4" />
            Dupliquer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dupliquer le bureau</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir dupliquer le bureau "{officeTitle}" ? Une
            copie sera créée avec le titre "{officeTitle} (2)" et vous pourrez
            la modifier ensuite.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={duplicateOffice.isPending}
          >
            Annuler
          </Button>
          <Button
            onClick={handleDuplicate}
            disabled={duplicateOffice.isPending}
          >
            {duplicateOffice.isPending ? "Duplication..." : "Dupliquer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
