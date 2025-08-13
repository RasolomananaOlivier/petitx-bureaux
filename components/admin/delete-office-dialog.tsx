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
import { Trash2 } from "lucide-react";
import { useDeleteOffice } from "@/hooks/use-delete-office";

interface DeleteOfficeDialogProps {
  officeId: number;
  officeTitle: string;
  trigger?: React.ReactNode;
}

export function DeleteOfficeDialog({
  officeId,
  officeTitle,
  trigger,
}: DeleteOfficeDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteOffice = useDeleteOffice();

  const handleDelete = async () => {
    try {
      await deleteOffice.mutateAsync(officeId);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting office:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le bureau</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le bureau "{officeTitle}" ? Cette
            action est irréversible et supprimera également toutes les photos et
            services associés.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteOffice.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteOffice.isPending}
          >
            {deleteOffice.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
