"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface DeleteUEDialogProps {
  ueId: number;
  ueName: string;
  onDelete: (ueId: number) => void;
}

export function DeleteUEDialog({
  ueId,
  ueName,
  onDelete,
}: DeleteUEDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/ue/delete/${ueId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting UE: ${response.status}`);
      }

      toast({
        title: "UE supprimée",
        description: `L'UE "${ueName}" a été supprimée avec succès.`,
        variant: "default",
      });

      onDelete(ueId);
    } catch (error) {
      console.error("Error deleting UE:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'UE",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;UE &quot;{ueName}&quot; ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
