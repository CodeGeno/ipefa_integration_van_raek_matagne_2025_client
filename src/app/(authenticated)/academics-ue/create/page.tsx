"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CalendarIcon } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

interface UEOption {
  id: number;
  name: string;
  section: number;
  periods: number;
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
    identifier: string;
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
  }[];
}

export default function CreateAcademicUEPage() {
  const [ueOptions, setUeOptions] = useState<UEOption[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedUE, setSelectedUE] = useState<UEOption | null>(null);
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const [formData, setFormData] = useState<FormState>({
    year: currentYear.toString(),
  });

  // Calculate sessions based on periods and dates
  const calculateSessions = (start: Date, end: Date, periods: number) => {
    const sessions = [];
    const numberOfSessions = Math.ceil(periods / 4);
    const DAYS_BETWEEN_SESSIONS = 7; // Une semaine calendrier

    for (let i = 0; i < numberOfSessions; i++) {
      const sessionDate = new Date(start);
      sessionDate.setDate(start.getDate() + i * DAYS_BETWEEN_SESSIONS);
      sessions.push({
        date: format(sessionDate, "yyyy-MM-dd"),
        status: "scheduled" as const,
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

  const handleUEChange = (value: string) => {
    const ue = ueOptions.find((u) => u.id.toString() === value);
    setSelectedUE(ue || null);
    handleChange("ue_id", value);
    handleChange("professorId", "");
  };

  async function getUEOptions() {
    try {
      const response = await get<UEOption[]>("/ue/list");

      if (!response.success) {
        throw new Error(`Error fetching UEs: ${response.status}`);
      }
      if (response.data) setUeOptions(response.data);
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
    getUEOptions();
    getProfessors();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedUE) {
        toast({
          title: "Erreur de validation",
          description: "Veuillez sélectionner une UE",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!startDate || !endDate) {
        toast({
          title: "Erreur de validation",
          description: "Veuillez sélectionner les dates de début et de fin",
          variant: "destructive",
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

      console.log("Submitting data:", completeData);
      console.log("Token:", localStorage.getItem("token"));

      const response = await post("/ue-management/academic-ues/", completeData);
      console.log("Response:", response);
      if (response.success) {
        toast({
          title: "Succès",
          description: "L'UE académique a été créée avec succès",
        });

        // Redirect after successful creation
        setTimeout(() => {
          router.push("/academics-ue");
        }, 2000);
      } else {
        console.error("Error response:", response);
        toast({
          title: "Erreur",
          description:
            response.message || "Une erreur est survenue lors de la création",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the DatePicker for sessions to prevent duplicate dates
  const handleSessionDateChange = (index: number, date: Date | undefined) => {
    if (date) {
      const newSessions = [...(formData.sessions || [])];
      const newDate = format(date, "yyyy-MM-dd");

      // Check if the date is already used by another session
      const isDateUsed = newSessions.some(
        (session, i) => i !== index && session.date === newDate
      );

      if (isDateUsed) {
        toast({
          title: "Erreur de validation",
          description: "Cette date est déjà utilisée par une autre séance",
          variant: "destructive",
        });
        return;
      }

      newSessions[index] = {
        ...newSessions[index],
        date: newDate,
      };
      setFormData((prev) => ({
        ...prev,
        sessions: newSessions,
      }));
    }
  };

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
            <CardTitle>Créer une nouvelle UE académique</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ue">Unité d&apos;enseignement</Label>
                <Select onValueChange={handleUEChange} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une UE" />
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
                  disabled={!selectedUE}
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
                      id="startDate"
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                      type="button"
                    >
                      {startDate ? (
                        format(startDate, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      selected={startDate || undefined}
                      onSelect={(date: Date | undefined) =>
                        date && setStartDate(date)
                      }
                      disabled={(date: Date) => date < new Date("2000-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                      type="button"
                    >
                      {endDate ? (
                        format(endDate, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      selected={endDate || undefined}
                      onSelect={(date: Date | undefined) =>
                        date && setEndDate(date)
                      }
                      disabled={(date: Date) => !startDate || date < startDate}
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
                  <div className="flex justify-between items-center">
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
                      Recalculer automatiquement
                    </Button>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-1 gap-4">
                      {formData.sessions.map((session, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-md flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-medium">
                              Séance {index + 1}
                            </span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-[200px] pl-3 text-left font-normal"
                                  type="button"
                                >
                                  {format(new Date(session.date), "PPP", {
                                    locale: fr,
                                  })}
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
                                    handleSessionDateChange(index, date)
                                  }
                                  disabled={(date: Date) => {
                                    if (!startDate || !endDate) return true;
                                    return date < startDate || date > endDate;
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <span className="text-sm text-gray-500">
                            {session.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Link href="/academics-ue">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedUE || !startDate || !endDate}
                className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSubmitting
                  ? "Création en cours..."
                  : "Créer l'UE académique"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
