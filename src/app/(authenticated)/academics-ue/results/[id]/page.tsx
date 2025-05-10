"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentResultsModal } from "@/components/StudentResultsModal";
import { AcademicUE, Student, Result } from "@/types";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedStudent, setSelectedStudent] = useState<{
    student: Student;
    results: Result[];
  } | null>(null);
  const [academicUE, setAcademicUE] = useState<AcademicUE | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/ue-management/academic-ues/${resolvedParams.id}/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error("Erreur lors du chargement des données");
        }

        setAcademicUE(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Impossible de charger les données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleViewResults = async (student: Student) => {
    if (!academicUE) return;

    const results =
      academicUE.results?.filter((r: Result) => r.student === student.id) || [];

    setSelectedStudent({
      student,
      results,
    });
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (error || !academicUE) {
    return (
      <div className="p-4">
        <p className="text-red-500">
          {error || "Impossible de charger les données"}
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <Link href="/academics-ue">
            <Button variant="outline">Retour à la liste des UE</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{academicUE.ue.name}</h1>
        <p className="text-gray-600">
          Année académique: {academicUE.year} | Périodes:{" "}
          {academicUE.ue.periods}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Étudiants inscrits</h2>
        {academicUE.students.length > 0 ? (
          <div className="mt-2 border rounded-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Matricule
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Nom
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Prénom
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {academicUE.students.map((student: Student) => (
                  <tr key={student.id} className="border-t">
                    <td className="px-4 py-2">
                      {student.contactDetails.identifier}
                    </td>
                    <td className="px-4 py-2">
                      {student.contactDetails.lastName}
                    </td>
                    <td className="px-4 py-2">
                      {student.contactDetails.firstName}
                    </td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">
                      <Button
                        onClick={() => handleViewResults(student)}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Gérer les résultats
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">Aucun étudiant inscrit</p>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Link href="/academics-ue">
          <Button variant="outline">Retour à la liste des UE</Button>
        </Link>
      </div>

      {selectedStudent && academicUE && (
        <StudentResultsModal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          academicUE={academicUE}
          student={selectedStudent.student}
          results={selectedStudent.results}
        />
      )}
    </div>
  );
}
