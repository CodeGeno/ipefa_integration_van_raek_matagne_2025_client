"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { get, patch } from "@/app/fetch";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

const statusStyles = {
  PROGRAMMED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  REPORTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const statusLabels = {
  PROGRAMMED: "Programmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  REPORTED: "Reporté",
};

export default function LessonsPage() {
  const params = useParams();
  const [academicUE, setAcademicUE] = useState<AcademicUE | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lesson;
    direction: "asc" | "desc";
  }>({ key: "lesson_date", direction: "asc" });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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

  const updateLessonStatus = async (
    lessonId: number,
    newStatus: string,
    newDate?: string
  ) => {
    try {
      setError(null);
      const lesson = academicUE?.lessons.find((l) => l.id === lessonId);
      if (!lesson) {
        throw new Error("Leçon non trouvée");
      }
      const response = await patch(`/ue-management/lessons/${lessonId}/`, {
        status: newStatus,
        lesson_date: newDate || lesson.lesson_date,
      });
      if (response.success) {
        getAcademicUE(); // Recharger les données
        setSortConfig({ key: "lesson_date", direction: "asc" });
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

  const getPaginatedLessons = (lessons: Lesson[]) => {
    const sortedLessons = sortLessons(lessons);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedLessons.slice(startIndex, endIndex);
  };

  const totalPages = academicUE
    ? Math.ceil(academicUE.lessons.length / itemsPerPage)
    : 0;

  const handleStatusChange = (lesson: Lesson, newStatus: string) => {
    if (newStatus === "REPORTED") {
      setSelectedLesson(lesson);
      setSelectedDate(new Date(lesson.lesson_date));
      setIsDatePickerOpen(true);
    } else {
      updateLessonStatus(lesson.id, newStatus);
    }
  };

  const handleDateConfirm = () => {
    if (selectedLesson && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      updateLessonStatus(selectedLesson.id, "REPORTED", formattedDate);
      setIsDatePickerOpen(false);
      setSelectedLesson(null);
      setSelectedDate(undefined);
    }
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Leçons
          </h1>
          <p className="text-muted-foreground">
            {academicUE?.ue.name} - {academicUE?.year}
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
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-2 border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-medium text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => requestSort("lesson_date")}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Date
                      {getSortIcon("lesson_date")}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Statut
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedLessons(academicUE?.lessons || []).map(
                  (lesson) => (
                    <tr
                      key={lesson.id}
                      className="border-t hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {new Date(lesson.lesson_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          value={lesson.status}
                          onValueChange={(value) =>
                            handleStatusChange(lesson, value)
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "w-[180px] transition-colors",
                              statusStyles[
                                lesson.status as keyof typeof statusStyles
                              ]
                            )}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(
                              ([value, label]) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  className={cn(
                                    "transition-colors",
                                    statusStyles[
                                      value as keyof typeof statusStyles
                                    ]
                                  )}
                                >
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="hover:bg-slate-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-slate-600">
                {academicUE?.lessons.length} leçons au total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choisir une nouvelle date</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDatePickerOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleDateConfirm}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
