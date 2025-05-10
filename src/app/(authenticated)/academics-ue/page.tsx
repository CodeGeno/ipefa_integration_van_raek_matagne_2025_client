"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { get } from "@/app/fetch";
import { useState, useEffect } from "react";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { UE } from "@/model/entity/ue/ue.entity";
import { Section } from "@/model/entity/ue/section.entity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AcademicUE {
  id: number;
  ue: UE;
  year: number;
  start_date: string;
  end_date: string;
  professor?: Employee | null;
  lessons: {
    id: number;
    lesson_date: string;
    status: string;
  }[];
}

export default function AcademicsUEPage() {
  const [academicsData, setAcademicsData] = useState<AcademicUE[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const getSections = async () => {
    try {
      const response = await get<Section[]>("/section/list/");
      if (response.success && response.data) {
        setSections(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
      setError("Erreur lors du chargement des sections");
    }
  };

  const getAcademicUEs = async () => {
    try {
      setError(null);
      console.log("Fetching academic UEs");
      const url =
        selectedSection !== "all"
          ? `/ue-management/academic-ues/?section_id=${selectedSection}`
          : "/ue-management/academic-ues/";
      const response = await get<AcademicUE[]>(url);

      if (!response.success) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      console.log(response.data);
      setAcademicsData(response.data as AcademicUE[]);
    } catch (error) {
      console.error("Failed to fetch academic UEs:", error);
      setError("Erreur lors du chargement des UE académiques");
    }
  };

  useEffect(() => {
    getSections();
  }, []);

  useEffect(() => {
    getAcademicUEs();
  }, [selectedSection]);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "PROGRAMMED":
        return "Programmé";
      case "COMPLETED":
        return "Terminé";
      case "CANCELLED":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Gestion des UE Académiques - Année {new Date().getFullYear()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sections</SelectItem>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id.toString()}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

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
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Section
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {academicsData.map((ue) => (
                    <tr key={ue.id} className="border-t">
                      <td className="px-4 py-2">{ue.id}</td>
                      <td className="px-4 py-2">{ue.ue.name}</td>
                      <td className="px-4 py-2">
                        {new Date(ue.start_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(ue.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {ue.professor
                          ? `${ue.professor.contactDetails.firstName} ${ue.professor.contactDetails.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2">{ue.ue.section}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Link href={`/academics-ue/lessons/${ue.id}`}>
                            <Button variant="outline" size="sm">
                              Gérer les leçons
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Aucune UE disponible</p>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <Link href="academics-ue/create">
              <Button variant="outline">Créer une nouvelle UE</Button>
            </Link>
            <Link href="academics-ue/">
              <Button variant="outline">Retour à la liste des UE</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
