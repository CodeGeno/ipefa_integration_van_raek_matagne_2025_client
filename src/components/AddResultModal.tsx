"use client";

import { useState, useEffect } from "react";
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
import { post, patch } from "@/app/fetch";

interface Result {
  id: number;
  result: number;
  period: number;
  success: boolean;
  isExempt: boolean;
  approved: boolean;
}

interface AddResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicUEId: string;
  studentId: string;
  maxPeriod: number;
  onSuccess: () => void;
  editingResult: Result | null;
}

export function AddResultModal({
  isOpen,
  onClose,
  academicUEId,
  studentId,
  maxPeriod,
  onSuccess,
  editingResult,
}: AddResultModalProps) {
  const [result, setResult] = useState<string>("");
  const [isExempt, setIsExempt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingResult) {
      setResult(editingResult.result?.toString() || "");
      setIsExempt(editingResult.isExempt);
    } else {
      setResult("");
      setIsExempt(false);
    }
  }, [editingResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        academicsUE: parseInt(academicUEId),
        student: parseInt(studentId),
        result: isExempt ? null : parseInt(result),
        isExempt,
      };

      let response;
      if (editingResult) {
        response = await patch(
          `/ue-management/results/${editingResult.id}/`,
          payload
        );
      } else {
        response = await post("/ue-management/results/", payload);
      }

      if (response.success) {
        onSuccess();
      } else {
        throw new Error(
          response.message || "Erreur lors de l'enregistrement du résultat"
        );
      }
    } catch (error) {
      console.error("Error saving result:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'enregistrement du résultat"
      );
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isExempt"
                checked={isExempt}
                onCheckedChange={setIsExempt}
              />
              <Label htmlFor="isExempt">Dispensé</Label>
            </div>

            {!isExempt && (
              <div className="space-y-2">
                <Label htmlFor="result">Résultat</Label>
                <Input
                  id="result"
                  type="number"
                  min="0"
                  max={maxPeriod * 10}
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Maximum: {maxPeriod * 10} points
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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
              {isLoading
                ? "Enregistrement..."
                : editingResult
                ? "Modifier"
                : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
