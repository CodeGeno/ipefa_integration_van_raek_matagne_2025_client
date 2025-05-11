"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentResultsModal } from "@/components/StudentResultsModal";
import { AcademicUE, Student } from "@/types";
import { get } from "@/app/fetch";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [academicUE, setAcademicUE] = useState<AcademicUE | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get<AcademicUE>(
          `/ue-management/academic-ues/${resolvedParams.id}/`
        );
        if (response.success && response.data) {
          setAcademicUE(response.data);
        } else {
          throw new Error("Erreur lors du chargement des données");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Impossible de charger les données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleViewResults = (student: Student) => {
    setSelectedStudent(student);
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!academicUE) {
    return <div className="p-4">UE non trouvée</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{academicUE.ue.name}</h1>
        <p className="text-gray-600">
          {academicUE.year} - {academicUE.ue.periods} périodes
        </p>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Liste des étudiants</h2>
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
          academicUEId={academicUE.id}
          studentId={selectedStudent.id}
        />
      )}
    </div>
  );
}
