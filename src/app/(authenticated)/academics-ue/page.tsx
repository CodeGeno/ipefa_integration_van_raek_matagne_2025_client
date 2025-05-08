"use client";
<<<<<<< HEAD

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
=======
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
>>>>>>> ec174f7eba1d6c23e87e1d03568db1d16ffb7fca
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { get } from "@/app/fetch";
import { useState, useEffect } from "react";
interface AcademicUE {
  id: number;
<<<<<<< HEAD
  year: number;
  start_date: string;
  end_date: string;
  ue: {
    id: number;
    name: string;
    section: {
      id: number;
      name: string;
    };
  };
}

interface UESession {
  id: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface Section {
  sectionId: number;
  name: string;
  sectionType: string;
  sectionCategory: string;
  description: string;
}

interface FormValues {
  label: string;
  sectionId: string;
  cycleYear: number;
  numberOfPeriods: number;
  startDate: Date;
  endDate: Date;
}

const AcademicUEPage = () => {
  const [academicUEs, setAcademicUEs] = useState<AcademicUE[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const fetchAcademicUEs = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/ue-management/academic-ues/"
      );
      const data = await response.json();
      if (data.success) {
        setAcademicUEs(data.data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les UE académiques",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la récupération des UE académiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNextYear = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/ue-management/academic-ues/generate-next-year/",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Succès",
          description: data.message,
        });
        fetchAcademicUEs(); // Rafraîchir la liste
      } else {
        toast({
          title: "Erreur",
          description:
            data.message || "Erreur lors de la génération des UE académiques",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la génération des UE académiques",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchAcademicUEs();
  }, []);

  return (
    <>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <CardTitle className="text-xl md:text-2xl">
          Liste des UE Académiques
        </CardTitle>
        <div className="w-full md:w-auto flex gap-2">
          <Button
            onClick={handleGenerateNextYear}
            disabled={generating}
            variant="secondary"
          >
            {generating ? "Génération..." : "Générer l'année suivante"}
          </Button>
          <Link className="w-full" href="/academics-ue/create">
            <Button className="w-full">Ajouter une UE académique</Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Form Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1 gap-2">
            <Label>Année</Label>
            <Input placeholder="ex: 2024" />
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <Label>Section</Label>
            <Input placeholder="ex: Bachelier en Informatique" />
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <Label>UE</Label>
            <Input placeholder="ex: Programmation Web" />
          </div>
        </div>

        {/* Filter Button */}
        <div className="flex w-full">
          <Button className="w-full">Filtrer</Button>
        </div>

        {/* List of Academic UEs */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : academicUEs.length === 0 ? (
            <div className="text-center py-4">Aucune UE académique trouvée</div>
          ) : (
            academicUEs.map((academicUE) => (
              <div
                key={academicUE.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border"
              >
                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-semibold">
                    {academicUE.ue.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {academicUE.ue.section.name} - {academicUE.year}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Du {new Date(academicUE.start_date).toLocaleDateString()} au{" "}
                    {new Date(academicUE.end_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <Link
                    href={`/academics-ue/${academicUE.id}`}
                    className="w-full md:w-auto"
                  >
                    <Button className="w-full md:w-auto" variant="outline">
                      Détails
                    </Button>
                  </Link>
                  <Button variant="secondary" className="w-full md:w-auto">
                    Modifier
                  </Button>
                  <Button variant="destructive" className="w-full md:w-auto">
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </>
  );
};

export default AcademicUEPage;
=======
  ue: string;
  year: number;
  startDate: string;
  endDate: string;
  professor?: string | null;
}

export default function AcademicsUEPage() {
  const [academicsData, setAcademicsData] = useState<AcademicUE[]>([]);

  const getAcademicUEs = async () => {
    try {
      console.log("Fetching academic UEs");
      const response = await get<AcademicUE[]>("/ue-management/academic-ues/");

      if (!response.success) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      console.log(response.data);
      setAcademicsData(response.data as AcademicUE[]);
    } catch (error) {
      console.error("Failed to fetch academic UEs:", error);
    }
  };

  useEffect(() => {
    getAcademicUEs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Gestion des UE Académiques - Année {new Date().getFullYear()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {academicsData.length > 0 ? (
            <div className="mt-2 border rounded-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Nom
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Date de début
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Date de fin
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Professeur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {academicsData.map((ue) => (
                    <tr key={ue.id} className="border-t">
                      <td className="px-4 py-2">{ue.id}</td>
                      <td className="px-4 py-2">{ue.ue}</td>
                      <td className="px-4 py-2">
                        {new Date(ue.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(ue.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{ue.professor || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Aucune UE disponible</p>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <Link href="/ue-management/academics-ue/create">
              <Button variant="outline">Créer une nouvelle UE</Button>
            </Link>
            <Link href="/ue-management/academics-ue">
              <Button variant="outline">Retour à la liste des UE</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
>>>>>>> ec174f7eba1d6c23e87e1d03568db1d16ffb7fca
