"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { get, patch } from "@/app/fetch";
import { useState, useEffect, useContext } from "react";
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
import { addDays, isBefore, startOfDay, format, parseISO } from "date-fns";
import Head from "next/head";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountContext } from "@/app/context";

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
  const { accountData } = useContext(AccountContext);
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

      if (newStatus === "REPORTED" && !newDate) {
        setSelectedLesson(lesson);
        const lessonDate = parseISO(lesson.lesson_date);
        setSelectedDate(lessonDate);
        setIsDatePickerOpen(true);
        return;
      }

      const response = await patch(`/ue-management/lessons/${lessonId}/`, {
        status: newStatus,
        lesson_date: newDate || lesson.lesson_date,
      });
      if (response.success) {
        getAcademicUE(); // Recharger les données
        setSortConfig({ key: "lesson_date", direction: "asc" });
        setIsDatePickerOpen(false);
        setSelectedDate(undefined);
      } else {
        throw new Error("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Failed to update lesson status:", error);
      setError("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && selectedLesson) {
      const formattedDate = format(date, "yyyy-MM-dd");
      updateLessonStatus(selectedLesson.id, "REPORTED", formattedDate);
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
    <div className="container mx-auto py-8 px-4">
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
            <div className="text-sm text-gray-500">
              Nombre total de séances : {academicUE?.lessons.length || 0}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-2 border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("lesson_date")}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon("lesson_date")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Statut
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  {accountData?.role === "ADMINISTRATOR" && (
                    <TableHead>Actions</TableHead>
                  )}

                  <TableHead>Présences</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {academicUE?.lessons &&
                  sortLessons(academicUE.lessons).map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        {format(parseISO(lesson.lesson_date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium",
                            statusStyles[
                              lesson.status as keyof typeof statusStyles
                            ]
                          )}
                        >
                          {statusLabels[
                            lesson.status as keyof typeof statusLabels
                          ] || lesson.status}
                        </span>
                      </TableCell>
                      {accountData?.role === "ADMINISTRATOR" && (
                        <TableCell>
                          <div className="flex gap-2">
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
                                <SelectItem value="PROGRAMMED">
                                  Programmé
                                </SelectItem>
                                <SelectItem value="REPORTED">
                                  Reporté
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                  Terminé
                                </SelectItem>
                                <SelectItem value="CANCELLED">
                                  Annulé
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      )}

                      <TableCell>
                        <Link href={`/academics-ue/attendance/${lesson.id}`}>
                          <Button variant="outline" size="sm">
                            Présences
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionner une nouvelle date</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={fr}
              className="rounded-md border"
              disabled={(date) => isBefore(date, startOfDay(new Date()))}
              fromDate={new Date()}
              defaultMonth={selectedDate}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDatePickerOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
