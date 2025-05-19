"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { get, patch } from "@/app/fetch";
import { useState, useEffect, useContext } from "react";
import { AddResultModal } from "./AddResultModal";
import { CheckCircle2, XCircle } from "lucide-react";
import { UE } from "@/types";
import { AccountContext } from "@/app/context";
import { Result } from "@/model/entity/ue/result.entity";
import { ApiResponse } from "@/model/api/api.response";

interface StudentResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicUEId: number;
  studentId: number;
  ue: UE;
}

export function StudentResultsModal({
  isOpen,
  onClose,
  academicUEId,
  studentId,
  ue,
}: StudentResultsModalProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const { accountData } = useContext(AccountContext);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Utiliser l'ID de l'étudiant depuis le accountData si l'utilisateur est un étudiant
      const currentStudentId =
        accountData.role === "STUDENT" ? accountData.account?.id : studentId;

      if (!currentStudentId) {
        throw new Error("ID de l'étudiant non trouvé");
      }

      // Utiliser le nouvel endpoint
      const url = `/ue-management/results/${academicUEId}/${currentStudentId}/`;

      const response = await get<ApiResponse<Result[]>>(url);

      if (response.success && response.data) {
        setResults(response.data as unknown as Result[]);
      } else {
        throw new Error(
          response.message || "Erreur lors du chargement des résultats"
        );
      }
    } catch (error) {
      setError("Erreur lors du chargement des résultats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveResult = async (
    resultId: number,
    currentApproved: boolean
  ) => {
    try {
      setError(null);
      const response = await patch(`/ue-management/results/${resultId}/`, {
        approved: !currentApproved,
      });

      if (response.success) {
        fetchResults();
      } else {
        throw new Error(
          "Erreur lors de la mise à jour du statut d'approbation"
        );
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour du statut d'approbation");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResults();
    }
  }, [isOpen, academicUEId, studentId, accountData.account?.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Résultats de l&apos;étudiant</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Liste des résultats</h3>
            {(accountData.role === "PROFESSOR" ||
              accountData.role === "ADMINISTRATOR") && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                Ajouter un résultat
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg">
              <p className="text-slate-600">Aucun résultat trouvé</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Résultat
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Périodes
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Statut
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Dispensé
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Approuvé
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {result.isExempt ? (
                          <span className="text-blue-600">Dispensé</span>
                        ) : (
                          <span className="font-medium">{result.result}</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{result.period}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.success
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.success ? "Réussi" : "Échoué"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.isExempt
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {result.isExempt ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {result.approved ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {!result.approved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingResult(result)}
                              className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                            >
                              Modifier
                            </Button>
                          )}

                          {(accountData.role === "EDUCATOR" ||
                            accountData.role === "ADMINISTRATOR") && (
                            <Button
                              variant="default"
                              size="sm"
                              disabled={result.approved}
                              onClick={() =>
                                handleApproveResult(result.id, result.approved)
                              }
                              className={
                                result.approved
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-primary hover:bg-primary/90"
                              }
                            >
                              {!result.approved ? "Approuver" : "Approuvé"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AddResultModal
          isOpen={isAddModalOpen || editingResult !== null}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingResult(null);
          }}
          academicUEId={academicUEId.toString()}
          studentId={studentId.toString()}
          maxPeriod={ue.periods}
          onSuccess={() => {
            fetchResults();
            setIsAddModalOpen(false);
            setEditingResult(null);
          }}
          editingResult={editingResult}
          ue={ue}
        />
      </DialogContent>
    </Dialog>
  );
}
