"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { post, patch } from "@/app/fetch";
import { useState } from "react";
import { UE } from "@/types";
import { Result } from "@/model/entity/ue/result.entity";

interface AddResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicUEId: string;
  studentId: string;
  maxPeriod: number;
  onSuccess: () => void;
  editingResult: Result | null;
  ue: UE;
}

export function AddResultModal({
  isOpen,
  onClose,
  academicUEId,
  studentId,
  maxPeriod,
  onSuccess,
  editingResult,
  ue,
}: AddResultModalProps) {
  const [result, setResult] = useState<string>(
    editingResult?.result?.toString() || ""
  );
  const [isExempt, setIsExempt] = useState<boolean>(
    editingResult?.isExempt || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const resultData = {
        result: isExempt ? null : parseFloat(result),
        period: editingResult?.period || 1,
        success: isExempt
          ? true
          : parseFloat(result) >= ue.minimum_success_score,
        isExempt,
        approved: false,
      };

      const response = editingResult
        ? await patch(`/ue-management/results/${editingResult.id}/`, resultData)
        : await post(
            `/ue-management/results/${academicUEId}/${studentId}/`,
            resultData
          );

      if (response.success) {
        onSuccess();
      } else {
        throw new Error(
          response.message || "Erreur lors de l'ajout du résultat"
        );
      }
    } catch (error) {
      console.error("Failed to submit result:", error);
      setError("Erreur lors de l'ajout du résultat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingResult ? "Modifier le résultat" : "Ajouter un résultat"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="result">Résultat</Label>
            <Input
              id="result"
              type="number"
              step="0.01"
              min="0"
              max="20"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              disabled={isExempt}
              required={!isExempt}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isExempt"
              checked={isExempt}
              onChange={(e) => setIsExempt(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isExempt">Dispensé</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
