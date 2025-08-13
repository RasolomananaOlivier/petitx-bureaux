import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminOffice } from "@/lib/api/admin-offices";
import { toast } from "sonner";

export function useDeleteOffice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminOffice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offices"] });
      toast.success("Bureau supprimé avec succès");
    },
    onError: (error) => {
      console.error("Error deleting office:", error);
      toast.error("Erreur lors de la suppression du bureau");
    },
  });
}
