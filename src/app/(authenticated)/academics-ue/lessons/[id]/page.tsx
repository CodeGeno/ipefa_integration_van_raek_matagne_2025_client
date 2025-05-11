"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { get, patch } from "@/app/fetch";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Lesson {
  id: number;
  lesson_date: string;
  status: string;
}

interface AcademicUE {
  id: number;
  ue: {
    name: string;
  };
  year: number;
  lessons: Lesson[];
}

export default function LessonsPage() {
  const params = useParams();
  const [academicUE, setAcademicUE] = useState<AcademicUE | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lesson;
    direction: "asc" | "desc";
  } | null>(null);

  const getAcademicUE = async () => {
    try {
      setError(null);
      const response = await get<AcademicUE>(
        `/ue-management/academic-ues/${params.id}/`
      );
      if (response.success && response.data) {
        setAcademicUE(response.data);
      } else {
        throw new Error("Erreur lors du chargement des données");
      }
    } catch (error) {
      console.error("Failed to fetch academic UE:", error);
      setError("Erreur lors du chargement des données");
    }
  };

  const updateLessonStatus = async (lessonId: number, newStatus: string) => {
    try {
      setError(null);
      const lesson = academicUE?.lessons.find((l) => l.id === lessonId);
      if (!lesson) {
        throw new Error("Leçon non trouvée");
      }
      const response = await patch(`/ue-management/lessons/${lessonId}/`, {
        status: newStatus,
        lesson_date: lesson.lesson_date,
      });
      if (response.success) {
        getAcademicUE(); // Recharger les données
      } else {
        throw new Error("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Failed to update lesson status:", error);
      setError("Erreur lors de la mise à jour du statut");
    }
  };

  useEffect(() => {
    getAcademicUE();
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROGRAMMED":
        return "text-blue-600";
      case "IN_PROGRESS":
        return "text-yellow-600";
      case "COMPLETED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const sortLessons = (lessons: Lesson[]) => {
    if (!sortConfig) return lessons;

    return [...lessons].sort((a, b) => {
      if (sortConfig.key === "lesson_date") {
        const dateA = new Date(a.lesson_date).getTime();
        const dateB = new Date(b.lesson_date).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key: keyof Lesson) => {
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

  const getSortIcon = (column: keyof Lesson) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpDown className="h-4 w-4 ml-1" />
    ) : (
      <ArrowUpDown className="h-4 w-4 ml-1" />
    );
  };

  if (!academicUE) {
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

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <Link href="/academics-ue">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à la liste des UE
              </Button>
            </Link>
            <CardTitle>Détails des leçons</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-2 border rounded-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 py-2 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("lesson_date")}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon("lesson_date")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-2 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Statut
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortLessons(academicUE.lessons).map((lesson) => (
                  <tr key={lesson.id} className="border-t">
                    <td className="px-4 py-2">
                      {new Date(lesson.lesson_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span className={getStatusColor(lesson.status)}>
                        {lesson.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={lesson.status}
                        onValueChange={(value) =>
                          updateLessonStatus(lesson.id, value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROGRAMMED">Programmé</SelectItem>
                          <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                          <SelectItem value="COMPLETED">Terminé</SelectItem>
                          <SelectItem value="CANCELLED">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
