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
  SelectGroup
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { get, post } from "@/app/fetch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DatePicker from "@/components/ui/date-picker";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface UEOption {
  id: string;
  name: string;
  section: string;
}

interface Professor {
  id: number;
  firstName: string;
  lastName: string;
}

interface AcademicUEFormData {
  ueId: string;
  professorId?: string;
  year: string;
  start_date: string;
  end_date: string;
  description?: string;
}

export default function CreateAcademicUEPage() {
  const [ueOptions, setUeOptions] = useState<UEOption[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<AcademicUEFormData>>({
    year: currentYear.toString(),
  });

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
      const response = await get<Professor[]>("/security/employee/teacher/list/");

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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the complete form data
      const completeData: AcademicUEFormData = {
        ...formData as AcademicUEFormData,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : ""
      };

      // Validate required fields
      if (!completeData.ueId || !completeData.year || !completeData.start_date || !completeData.end_date) {
        toast({
          title: "Erreur de validation",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        return;
      }

      const response = await post("/ue-management/academic-ues/", completeData);

      if (response.success) {
        toast({
          title: "Succès",
          description: "L'UE académique a été créée avec succès"
        });

        // Redirect after successful creation
        setTimeout(() => {
          router.push("/academics-ue");
        }, 2000);
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Une erreur est survenue lors de la création",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur inattendue est survenue",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Link
                  href="/academics-ue"
                  className="flex items-center text-sm text-gray-500 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour à la liste
              </Link>
              <CardTitle>Créer une nouvelle UE académique</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ue">Unité d&apos;enseignement</Label>
                  <Select
                      onValueChange={(value) => handleChange("ueId", value)}
                      required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une UE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {ueOptions.map((ue) => (
                            <SelectItem key={ue.id} value={ue.id}>
                              {ue.name}
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un professeur (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {professors.map((prof: Professor) => (
                            <SelectItem key={prof.id} value={prof.id}>
                              {prof.firstName} {prof.lastName}
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
                          selected={startDate}
                          onSelect={(date) => setStartDate(date)}
                          disabled={(date) => date < new Date("2000-01-01")}
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
                          selected={endDate}
                          onSelect={(date) => setEndDate(date)}
                          disabled={(date) => startDate && date < startDate}
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
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Link href="/academics-ue">
                  <Button variant="outline" type="button">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Création en cours..." : "Créer l'UE académique"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}