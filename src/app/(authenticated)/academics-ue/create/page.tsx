"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CalendarIcon, Save, BadgeCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { get, post } from "@/app/fetch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DatePicker from "@/components/ui/date-picker";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UEOption {
  id: number;
  name: string;
  section: number;
  periods: number;
  isActive: boolean;
}

interface Section {
  id: number;
  name: string;
  sectionType: string;
  sectionCategory: string;
  description: string;
  isActive: boolean;
}

interface AcademicUE {
  id: number;
  year: number;
  ue: {
    id: number;
    name: string;
  };
}

interface Professor {
  id: number;
  role: string;
  contactDetails: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
  };
  address: {
    id: number;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    number: string;
    complement: string;
    state: string;
  };
  email: string;
  matricule: string;
}

interface AcademicUEFormData {
  ue_id: number;
  year: number;
  start_date: string;
  end_date: string;
  professor_id?: number;
  lessons_data: {
    lesson_date: string;
  }[];
}

interface FormState {
  year: string;
  description?: string;
  professorId?: string;
  sessions?: {
    date: string;
    status: "scheduled" | "completed" | "cancelled";
    isOverlapping: boolean;
  }[];
}

export default function CreateAcademicUEPage() {
  const [ueOptions, setUeOptions] = useState<UEOption[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedUE, setSelectedUE] = useState<UEOption | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const [formData, setFormData] = useState<FormState>({
    year: currentYear.toString(),
  });

  // Mettre à jour la date de fin quand la date de début change
  useEffect(() => {
    if (startDate && (!endDate || endDate < startDate)) {
      setEndDate(startDate);
    }
  }, [startDate]);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && startDate && date < startDate) {
      toast.error("Date invalide", {
        description:
          "La date de fin ne peut pas être antérieure à la date de début",
        duration: 3000,
      });
      return;
    }
    setEndDate(date);
  };

  // Calculate sessions based on periods and dates
  const calculateSessions = (start: Date, end: Date, periods: number) => {
    const sessions = [];
    const numberOfSessions = Math.ceil(periods / 4);
    const DAYS_BETWEEN_SESSIONS = 7; // Une semaine calendrier

    for (let i = 0; i < numberOfSessions; i++) {
      const sessionDate = new Date(start);
      sessionDate.setDate(start.getDate() + i * DAYS_BETWEEN_SESSIONS);

      sessions.push({
        date:
          sessionDate > end
            ? format(end, "yyyy-MM-dd")
            : format(sessionDate, "yyyy-MM-dd"),
        status: "scheduled" as const,
        isOverlapping: false,
      });
    }

    return sessions;
  };

  // Update sessions when dates or UE changes
  useEffect(() => {
    if (startDate && endDate && selectedUE) {
      const sessions = calculateSessions(
        startDate,
        endDate,
        selectedUE.periods
      );
      setFormData((prev) => ({
        ...prev,
        sessions,
      }));
    }
  }, [startDate, endDate, selectedUE]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (value: string) => {
    const section = sections.find((s) => s.id.toString() === value);
    setSelectedSection(section || null);
    setSelectedUE(null);
    handleChange("ue_id", "");
  };

  const handleUEChange = (value: string) => {
    const ue = ueOptions.find((u) => u.id.toString() === value);
    setSelectedUE(ue || null);
    handleChange("ue_id", value);
    handleChange("professorId", "");
  };

  async function getSections() {
    try {
      const response = await get<Section[]>("/section/list/");
      if (!response.success) {
        throw new Error(`Error fetching sections: ${response.status}`);
      }
      if (response.data) {
        setSections(response.data.filter((section) => section.isActive));
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    }
  }

  async function getUEOptions() {
    try {
      const [ueResponse, academicUEResponse] = await Promise.all([
        get<UEOption[]>("/ue/list"),
        get<AcademicUE[]>("/ue-management/academic-ues/"),
      ]);

      if (!ueResponse.success) {
        throw new Error(`Error fetching UEs: ${ueResponse.status}`);
      }

      if (!academicUEResponse.success) {
        throw new Error(
          `Error fetching Academic UEs: ${academicUEResponse.status}`
        );
      }

      if (ueResponse.data && academicUEResponse.data) {
        // Filtrer uniquement les UE actives et de la section sélectionnée
        const activeUEs = ueResponse.data.filter(
          (ue) =>
            ue.isActive &&
            (!selectedSection || ue.section === selectedSection.id)
        );

        // Filtrer les UE qui n'ont pas encore été utilisées pour l'année sélectionnée
        const year = parseInt(formData.year);
        const usedUEIds = new Set(
          academicUEResponse.data
            .filter((academicUE) => academicUE.year === year)
            .map((academicUE) => academicUE.ue.id)
        );

        const availableUEs = activeUEs.filter((ue) => !usedUEIds.has(ue.id));
        setUeOptions(availableUEs);
      }
    } catch (error) {
      console.error("Failed to fetch UEs:", error);
    }
  }

  async function getProfessors() {
    try {
      const response = await get<Professor[]>(
        "/security/employee/teacher/list/"
      );

      if (!response.success) {
        throw new Error(`Error fetching professors: ${response.status}`);
      }
      if (response.data) setProfessors(response.data);
    } catch (error) {
      console.error("Failed to fetch professors:", error);
    }
  }

  useEffect(() => {
    getSections();
  }, []);

  useEffect(() => {
    if (formData.year) {
      getUEOptions();
    }
    getProfessors();
  }, [formData.year, selectedSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!selectedUE) {
        toast.error("Erreur de validation", {
          description: "Veuillez sélectionner une UE",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      if (!startDate || !endDate) {
        toast.error("Erreur de validation", {
          description: "Veuillez sélectionner les dates de début et de fin",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare the complete form data with only the required fields
      const completeData: AcademicUEFormData = {
        ue_id: selectedUE.id,
        year: parseInt(formData.year),
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        lessons_data:
          formData.sessions?.map((session) => ({
            lesson_date: session.date,
          })) || [],
      };

      // Add professor ID if selected
      if (formData.professorId) {
        completeData.professor_id = parseInt(formData.professorId);
      }

      const response = await post("/ue-management/academic-ues/", completeData);

      if (!response.success) {
        throw new Error(response.message || "Une erreur est survenue");
      }

      // Attendre un peu pour s'assurer que tout est bien terminé
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Afficher le toast de succès
      toast.success("UE académique créée avec succès", {
        description: `L'unité d'enseignement "${selectedUE.name}" a été créée avec succès. Vous allez être redirigé...`,
        duration: 3000,
        icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
      });

      // Attendre que le toast soit visible avant de rediriger
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/academics-ue");
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Erreur lors de la création", {
        description:
          "Une erreur est survenue lors de la création de l'UE académique. Veuillez réessayer.",
        duration: 5000,
      });
    }
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    if (!selectedUE || !startDate || !endDate) return false;
    if (!formData.sessions || formData.sessions.length === 0) return false;

    // Vérifier s'il y a des dates en double
    const dates = formData.sessions.map((session) => session.date);
    const hasDuplicates = dates.some(
      (date, index) => dates.indexOf(date) !== index
    );

    // Vérifier s'il y a des dates vides
    const hasEmptyDates = dates.some((date) => !date);

    return !hasDuplicates && !hasEmptyDates;
  };

  const handleSessionDateChange = (index: number, date: Date | undefined) => {
    if (!date) return;

    try {
      const newSessions = [...(formData.sessions || [])];
      const newDate = format(date, "yyyy-MM-dd");

      // Check if the date is already used by another session
      const isDateUsed = newSessions.some(
        (session, i) => i !== index && session.date === newDate
      );

      if (isDateUsed) {
        toast.error("Erreur de validation", {
          description: "Cette date est déjà utilisée par une autre séance",
        });
        return;
      }

      // Check if the date is within the valid range
      if (startDate && endDate && (date < startDate || date > endDate)) {
        toast.error("Erreur de validation", {
          description:
            "La date doit être comprise entre la date de début et la date de fin",
        });
        return;
      }

      newSessions[index] = {
        ...newSessions[index],
        date: newDate,
        isOverlapping: false,
      };

      // Check for overlapping dates after the update
      const updatedSessions = newSessions.map((session, i) => {
        const isOverlapping = newSessions.some(
          (otherSession, j) =>
            i !== j && otherSession.date === session.date && session.date !== "" // Ne pas marquer comme en conflit si la date est vide
        );
        return { ...session, isOverlapping };
      });

      setFormData((prev) => ({
        ...prev,
        sessions: updatedSessions,
      }));
    } catch (error) {
      toast.error("Erreur de validation", {
        description: "La date sélectionnée n'est pas valide",
      });
    }
  };

  // Calculer les séances à afficher pour la page courante
  const getCurrentPageSessions = () => {
    if (!formData.sessions) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return formData.sessions.slice(startIndex, endIndex);
  };

  // Calculer le nombre total de pages
  const totalPages = formData.sessions
    ? Math.ceil(formData.sessions.length / itemsPerPage)
    : 0;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <Link href="/academics-ue">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la liste des UE
              </Button>
            </Link>
            <CardTitle>Créer une nouvelle UE académique</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  onValueChange={handleSectionChange}
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sections.map((section) => (
                        <SelectItem
                          key={section.id}
                          value={section.id.toString()}
                        >
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ue">Unité d&apos;enseignement</Label>
                <Select
                  onValueChange={handleUEChange}
                  required
                  disabled={isSubmitting || !selectedSection}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedSection
                          ? "Sélectionner une UE"
                          : "Sélectionnez d'abord une section"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ueOptions.map((ue) => (
                        <SelectItem key={ue.id} value={ue.id.toString()}>
                          {ue.name} ({ue.periods} périodes)
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="professor">Professeur</Label>
                <Select
                  onValueChange={(value) => handleChange("professorId", value)}
                  disabled={!selectedUE || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedUE
                          ? "Sélectionner un professeur (optionnel)"
                          : "Sélectionnez d'abord une UE"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {professors.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id.toString()}>
                          {prof.contactDetails.firstName}{" "}
                          {prof.contactDetails.lastName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Année académique</Label>
                <Select
                  onValueChange={(value) => handleChange("year", value)}
                  defaultValue={currentYear.toString()}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={(currentYear - 1).toString()}>
                      {currentYear - 1}
                    </SelectItem>
                    <SelectItem value={currentYear.toString()}>
                      {currentYear}
                    </SelectItem>
                    <SelectItem value={(currentYear + 1).toString()}>
                      {currentYear + 1}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      disabled={isSubmitting}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      selected={endDate}
                      onSelect={handleEndDateChange}
                      disabled={isSubmitting}
                      minDate={startDate || undefined}
                      fromDate={startDate || undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description (optionnelle)</Label>
                <textarea
                  id="description"
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full min-h-[100px] p-2 border rounded"
                />
              </div>

              {formData.sessions && formData.sessions.length > 0 && (
                <div className="space-y-2 md:col-span-2">
                  <div className="flex gap-4 items-center">
                    <Label>Séances planifiées</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (startDate && endDate && selectedUE) {
                          const sessions = calculateSessions(
                            startDate,
                            endDate,
                            selectedUE.periods
                          );
                          setFormData((prev) => ({
                            ...prev,
                            sessions,
                          }));
                        }
                      }}
                    >
                      Réinitialiser les séances par défaut
                    </Button>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-1 gap-4">
                      {getCurrentPageSessions().map((session, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md flex items-center justify-between ${
                            session.isOverlapping
                              ? "bg-red-50 border border-red-200"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-medium">
                              Séance{" "}
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-[200px] pl-3 text-left font-normal ${
                                    session.isOverlapping
                                      ? "border-red-300 text-red-600"
                                      : ""
                                  }`}
                                  type="button"
                                >
                                  {session.date
                                    ? format(new Date(session.date), "PPP", {
                                        locale: fr,
                                      })
                                    : "Date à définir"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <DatePicker
                                  selected={new Date(session.date)}
                                  onSelect={(date: Date | undefined) =>
                                    handleSessionDateChange(
                                      (currentPage - 1) * itemsPerPage + index,
                                      date
                                    )
                                  }
                                  disabled={(date: Date) => {
                                    if (!startDate || !endDate) return true;
                                    return date < startDate || date > endDate;
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <span
                            className={`text-sm ${
                              session.isOverlapping
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </Button>
                        <span className="flex items-center px-4">
                          Page {currentPage} sur {totalPages}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          Suivant
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    <span>Création en cours...</span>
                  </>
                ) : !isFormValid() ? (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Dates invalides</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Créer l UE académique</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
