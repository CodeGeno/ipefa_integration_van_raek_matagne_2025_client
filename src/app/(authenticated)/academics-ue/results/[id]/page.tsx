"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentResultsModal } from "@/components/StudentResultsModal";
import { AcademicUE, Student } from "@/types";
import { get } from "@/app/fetch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  GraduationCap,
  Users,
  Clock,
  BookOpen,
  ArrowUpDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "asc" | "desc";
  } | null>(null);

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

  const requestSort = (key: keyof Student) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (column: keyof Student) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpDown className="h-4 w-4 ml-1" />
    ) : (
      <ArrowUpDown className="h-4 w-4 ml-1" />
    );
  };

  const sortedStudents = academicUE?.students
    ? [...academicUE.students].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        let comparison = 0;

        switch (key) {
          case "contactDetails":
            comparison = a.contactDetails.lastName.localeCompare(
              b.contactDetails.lastName
            );
            break;
          default:
            return 0;
        }

        return direction === "asc" ? comparison : -comparison;
      })
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Chargement...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">{error}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!academicUE) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>UE non trouvée</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Résultats des étudiants
          </h1>
          <p className="text-muted-foreground">
            {academicUE.ue.name} - {academicUE.year}
          </p>
        </div>
        <Link href="/academics-ue">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste des UE
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-slate-600">
              <BookOpen className="h-4 w-4" />
              <span>{academicUE.ue.periods} périodes</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="h-4 w-4" />
              <span>{academicUE.students.length} étudiants inscrits</span>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Liste des étudiants
            </h2>
            {academicUE.students.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => requestSort("contactDetails")}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Nom
                          {getSortIcon("contactDetails")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Prénom
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Identifiant
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Email
                        </div>
                      </TableHead>
                      <TableHead className="flex items-center gap-2">
                        Résultats
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStudents.map((student: Student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.contactDetails.lastName}
                        </TableCell>
                        <TableCell>
                          {student.contactDetails.firstName}
                        </TableCell>
                        <TableCell>{student.identifier}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleViewResults(student)}
                            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                          >
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Gérer les résultats
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg">
                <p className="text-slate-600">Aucun étudiant inscrit</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedStudent && academicUE && (
        <StudentResultsModal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          academicUEId={academicUE.id}
          studentId={selectedStudent.id}
          ue={academicUE.ue}
        />
      )}
    </div>
  );
}
