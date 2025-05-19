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

  const maxScore = ue.periods * 10;
  const minScore = maxScore / 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const resultData = {
        result: isExempt ? null : parseFloat(result),
        period: ue.periods,
        success: isExempt ? true : parseFloat(result) >= minScore,
        isexempt: isExempt,
      };

      const response = editingResult
        ? await patch(`/ue-management/results/${editingResult.id}/`, resultData)
        : await post(`/ue-management/results/`, {
            ...resultData,
            academicsueId: parseInt(academicUEId),
            studentid: parseInt(studentId),
          });

      if (response.success) {
        onSuccess();
      } else {
        throw new Error(
          response.message || "Erreur lors de l'ajout du résultat"
        );
      }
    } catch {
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
              min={maxScore / 2}
              max={maxScore}
              value={result}
              onChange={(e) => setResult(e.target.value)}
              disabled={isExempt}
              required={!isExempt}
            />
            <p className="text-sm text-gray-500">
              Score minimum requis pour réussir : {minScore}/{maxScore}
            </p>
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
