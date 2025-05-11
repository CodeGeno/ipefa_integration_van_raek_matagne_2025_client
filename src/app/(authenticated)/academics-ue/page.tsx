"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPaginated } from "@/app/fetch";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createUrlWithParams } from "@/utils/url";
import { ApiPaginatedResponse } from "@/model/api/api.response";
import PaginationComponent from "@/components/pagination-component";

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

export default function AcademicsUEPage({
  url,
  searchValue,
  sectionValue,
  cycleValue,
  activeOnlyValue,
}: {
  url: string;
  searchValue: string;
  sectionValue: string;
  cycleValue: string;
  activeOnlyValue: string;
}) {
  const [academicsData, setAcademicsData] =
    useState<ApiPaginatedResponse<AcademicUE[]>>();
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");
  const [section, setSection] = useState<string>(sectionValue || "all");
  const [cycle, setCycle] = useState<string>(cycleValue || "all");
  const [activeOnly, setActiveOnly] = useState<boolean>(
    activeOnlyValue === "true"
  );

  const getSections = async () => {
    try {
      const response = await getPaginated<Section[]>("/section/list/");
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
      const params = new URLSearchParams();

      if (searchInput) params.append("name", searchInput);
      if (section !== "all") params.append("section_id", section);
      if (cycle !== "all") params.append("cycle", cycle);
      if (activeOnly) params.append("active_only", "true");

      const queryString = params.toString();
      const apiUrl = `/ue-management/academic-ues/${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await getPaginated<AcademicUE[]>(apiUrl);

      if (response.success) {
        setAcademicsData(response);
      }
    } catch (error) {
      console.error("Failed to fetch academic UEs:", error);
      setError("Erreur lors du chargement des UEs académiques");
    }
  };

  useEffect(() => {
    getSections();
  }, []);

  useEffect(() => {
    getAcademicUEs();
  }, [url, searchInput, section, cycle, activeOnly]);

  const handleSearch = async () => {
    const searchParams = {
      name: searchInput,
      section_id: section === "all" ? undefined : section,
      cycle: cycle === "all" ? undefined : cycle,
      active_only: activeOnly ? "true" : undefined,
    };
    await router.push(createUrlWithParams("/academics-ue", searchParams));
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") await handleSearch();
  };

  const handleFilter = async () => {
    const filterParams = {
      name: searchInput,
      page: 1,
      section_id: section === "all" ? undefined : section,
      cycle: cycle === "all" ? undefined : cycle,
      active_only: activeOnly ? "true" : undefined,
    };
    await router.push(createUrlWithParams("/academics-ue", filterParams));
  };

  const handleReset = async () => {
    setSearchInput("");
    setSection("all");
    setCycle("all");
    setActiveOnly(false);
    await router.push("/academics-ue");
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-4 items-center">
            Gestion des UE Académiques - Année {new Date().getFullYear()}
            <Link href="academics-ue/create">
              <Button variant="outline">+ Ajouter UE Académique</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:px-0">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col flex-1 gap-2">
                <Label>Nom de l&apos;UE</Label>
                <Input
                  placeholder="Rechercher une UE..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <Label>Section</Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sections</SelectItem>
                    {sections.map((section) => (
                      <SelectItem
                        key={section.id}
                        value={section.id.toString()}
                      >
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <Label>Cycle</Label>
                <Select value={cycle} onValueChange={setCycle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les cycles</SelectItem>
                    <SelectItem value="1">Cycle 1</SelectItem>
                    <SelectItem value="2">Cycle 2</SelectItem>
                    <SelectItem value="3">Cycle 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active-filter"
                    checked={activeOnly}
                    onCheckedChange={setActiveOnly}
                  />
                  <Label htmlFor="active-filter">UEs actives uniquement</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full py-4 gap-4">
            <Button className="w-full" onClick={handleFilter}>
              Filtrer
            </Button>
            <Button variant="outline" className="w-full" onClick={handleReset}>
              Réinitialiser les filtres
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {academicsData && academicsData.data.length > 0 ? (
            <>
              <div className="mt-2 border rounded-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Nom
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Section
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Cycle
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicsData.data.map((ue) => (
                      <tr key={ue.id} className="border-t">
                        <td className="px-4 py-2">{ue.ue.name}</td>
                        <td className="px-4 py-2">
                          {sections.find((s) => s.id === ue.ue.section)?.name ||
                            "N/A"}
                        </td>
                        <td className="px-4 py-2">Cycle {ue.ue.cycle}</td>
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
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Link
                              href={`/academics-ue/lessons/${ue.id}`}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              Gérer les leçons
                            </Link>
                            <Link
                              href={`/academics-ue/results/${ue.id}`}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                              Gérer les résultats
                            </Link>
                            <Link
                              href={`/academics-ue/register/${ue.id}`}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                            >
                              Gérer les inscriptions
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationComponent
                totalPages={academicsData.total_pages}
                currentPage={academicsData.page}
                search={searchInput}
                onPageChange={(page) => {
                  const params = {
                    name: searchInput,
                    page,
                    section_id: section === "all" ? undefined : section,
                    cycle: cycle === "all" ? undefined : cycle,
                    active_only: activeOnly ? "true" : undefined,
                  };
                  router.push(createUrlWithParams("/academics-ue", params));
                }}
              />
            </>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Aucune UE disponible</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
