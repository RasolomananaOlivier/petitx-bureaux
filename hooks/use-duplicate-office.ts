import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateAdminOffice } from "@/lib/api/admin-offices";
import { toast } from "sonner";

export function useDuplicateOffice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicateAdminOffice,
    onSuccess: (duplicatedOffice) => {
      queryClient.invalidateQueries({ queryKey: ["admin-offices"] });
      toast.success(`Bureau "${duplicatedOffice.title}" dupliqué avec succès`);
    },
    onError: (error) => {
      console.error("Error duplicating office:", error);
      toast.error("Erreur lors de la duplication du bureau");
    },
  });
}
