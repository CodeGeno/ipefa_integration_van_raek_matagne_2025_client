"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AcademicUE, Student, Result } from "@/types";
import { AddResultModal } from "./AddResultModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudentResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicUE: AcademicUE;
  student: Student;
  results: Result[];
}

export function StudentResultsModal({
  isOpen,
  onClose,
  academicUE,
  student,
  results: initialResults,
}: StudentResultsModalProps) {
  const [isAddResultModalOpen, setIsAddResultModalOpen] = useState(false);
  const [results, setResults] = useState<Result[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPoints = academicUE.ue.periods * 10;
  const passingScore = totalPoints * 0.5;

  const fetchResults = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/ue-management/results/${academicUE.id}/${student.id}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des résultats");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(
          data.message || "Erreur lors du chargement des résultats"
        );
      }

      setResults(data.data);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors du chargement des résultats"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResults();
    }
  }, [isOpen, academicUE.id, student.id]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Résultats - {student.contactDetails.firstName}{" "}
              {student.contactDetails.lastName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Matricule</h3>
                <p>{student.contactDetails.identifier}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">UE</h3>
                <p>{academicUE.ue.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Périodes</h3>
                <p>{academicUE.ue.periods} périodes</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Points totaux
                </h3>
                <p>{totalPoints} points (50% requis pour réussir)</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Résultats</h3>
                <Button onClick={() => setIsAddResultModalOpen(true)}>
                  Ajouter un résultat
                </Button>
              </div>

              {isLoading ? (
                <p>Chargement des résultats...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : results.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          Résultat
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result: Result) => (
                        <tr key={`result-${result.id}`} className="border-t">
                          <td className="px-4 py-2">
                            {result.isExempt ? (
                              <span className="text-gray-500">Dispensé</span>
                            ) : (
                              `${result.result} / ${totalPoints}`
                            )}
                          </td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Aucun résultat enregistré</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddResultModal
        isOpen={isAddResultModalOpen}
        onClose={() => setIsAddResultModalOpen(false)}
        academicUEId={academicUE.id.toString()}
        studentId={student.id.toString()}
        maxPeriod={academicUE.ue.periods}
        onSuccess={() => {
          setIsAddResultModalOpen(false);
          fetchResults();
        }}
      />
    </>
  );
}
