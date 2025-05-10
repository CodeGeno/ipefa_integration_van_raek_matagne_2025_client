"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface ActivateUEButtonProps {
  ueId: number;
  ueName: string;
  onActivate: (ueId: number) => void;
}

export function ActivateUEButton({
  ueId,
  ueName,
  onActivate,
}: ActivateUEButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/ue/update/${ueId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error activating UE: ${response.status}`);
      }

      toast({
        title: "UE activée",
        description: `L'UE "${ueName}" a été activée avec succès.`,
        variant: "default",
      });

      onActivate(ueId);
    } catch (error) {
      console.error("Error activating UE:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation de l'UE",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleActivate}
      disabled={isActivating}
    >
      {isActivating ? "Activation..." : "Activer"}
    </Button>
  );
}
