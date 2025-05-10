"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicUEId: string;
  studentId: string;
  maxPeriod: number;
  onSuccess: () => void;
}

export function AddResultModal({
  isOpen,
  onClose,
  academicUEId,
  studentId,
  maxPeriod,
  onSuccess,
}: AddResultModalProps) {
  const [result, setResult] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPoints = maxPeriod * 10;
  const passingScore = totalPoints * 0.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ue-management/results/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            academicsueId: parseInt(academicUEId),
            studentid: parseInt(studentId),
            period: maxPeriod,
            result: isSuccess ? parseFloat(result) : 0,
            success: isSuccess,
            isexempt: false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erreur lors de l'ajout du résultat");
      }

      onSuccess();
    } catch (error) {
      console.error("Error adding result:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'ajout du résultat"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un résultat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="success"
                checked={isSuccess}
                onCheckedChange={setIsSuccess}
              />
              <Label htmlFor="success">Réussite</Label>
            </div>
            <p className="text-sm text-gray-500">
              {isSuccess
                ? "L'étudiant a réussi. Veuillez encoder le résultat."
                : "L'étudiant n'a pas réussi."}
            </p>
          </div>

          {isSuccess && (
            <div className="space-y-2">
              <Label htmlFor="result">Résultat</Label>
              <Input
                id="result"
                type="number"
                min={passingScore}
                max={totalPoints}
                step="0.1"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder={`Entre ${passingScore} et ${totalPoints}`}
                required
              />
              <p className="text-sm text-gray-500">
                Total des points : {totalPoints} (nombre de périodes × 10)
              </p>
              <p className="text-sm text-gray-500">
                Note de réussite : {passingScore} (50% du total)
              </p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
