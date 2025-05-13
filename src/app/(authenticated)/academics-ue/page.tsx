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
import {
  ArrowUpDown,
  BookOpen,
  Calendar,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  yearValue,
}: {
  url: string;
  searchValue: string;
  sectionValue: string;
  cycleValue: string;
  activeOnlyValue: string;
  yearValue: string;
}) {
  const [academicsData, setAcademicsData] =
    useState<ApiPaginatedResponse<AcademicUE[]>>();
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");
  const [section, setSection] = useState<string>(sectionValue || "all");
  const [cycle, setCycle] = useState<string>(cycleValue || "all");
  const [year, setYear] = useState<string>(
    yearValue || new Date().getFullYear().toString()
  );
  const [activeOnly, setActiveOnly] = useState<boolean>(
    activeOnlyValue === "true" || true
  );

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

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
      if (year) params.append("year", year);
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
  }, [url, searchInput, section, cycle, year, activeOnly]);

  const handleSearch = async () => {
    const searchParams = {
      name: searchInput,
      section_id: section === "all" ? undefined : section,
      cycle: cycle === "all" ? undefined : cycle,
      year: year,
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
      year: year,
      active_only: activeOnly ? "true" : undefined,
    };
    await router.push(createUrlWithParams("/academics-ue", filterParams));
  };

  const handleReset = async () => {
    setSearchInput("");
    setSection("all");
    setCycle("all");
    setYear(new Date().getFullYear().toString());
    setActiveOnly(false);
    await router.push("/academics-ue");
  };

  const handleSort = (key: string) => {
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

  const sortedData = academicsData?.data
    ? [...academicsData.data].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        let comparison = 0;

        switch (key) {
          case "name":
            comparison = a.ue.name.localeCompare(b.ue.name);
            break;
          case "section":
            const sectionA =
              sections.find((s) => s.id === a.ue.section)?.name || "";
            const sectionB =
              sections.find((s) => s.id === b.ue.section)?.name || "";
            comparison = sectionA.localeCompare(sectionB);
            break;
          case "cycle":
            comparison = a.ue.cycle - b.ue.cycle;
            break;
          case "start_date":
            comparison =
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime();
            break;
          case "end_date":
            comparison =
              new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
            break;
          case "professor":
            const profA = a.professor
              ? `${a.professor.contactDetails.firstName} ${a.professor.contactDetails.lastName}`
              : "";
            const profB = b.professor
              ? `${b.professor.contactDetails.firstName} ${b.professor.contactDetails.lastName}`
              : "";
            comparison = profA.localeCompare(profB);
            break;
          default:
            return 0;
        }

        return direction === "asc" ? comparison : -comparison;
      })
    : [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">UE Académiques</h1>
          <p className="text-muted-foreground">
            Gérez les unités d'enseignement académiques
          </p>
        </div>
        <Link href="academics-ue/create">
          <Button className="bg-primary hover:bg-primary/90 transition-colors">
            <BookOpen className="w-4 h-4 mr-2" />
            Ajouter une UE Académique
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Recherche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une UE..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Section</Label>
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

              <div className="space-y-2">
                <Label className="text-sm font-medium">Cycle</Label>
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

              <div className="space-y-2">
                <Label className="text-sm font-medium">Année</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg">
                <Switch
                  id="active-filter"
                  checked={activeOnly}
                  onCheckedChange={setActiveOnly}
                />
                <Label htmlFor="active-filter" className="text-sm font-medium">
                  UEs actives uniquement
                </Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  Réinitialiser
                </Button>
                <Button onClick={handleFilter}>Filtrer</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          {academicsData?.data && academicsData.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-slate-500">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center space-x-1 hover:text-slate-700"
                        >
                          <span>Nom de l'UE</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="text-left p-3 font-medium text-slate-500">
                        <button
                          onClick={() => handleSort("section")}
                          className="flex items-center space-x-1 hover:text-slate-700"
                        >
                          <span>Section</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="text-left p-3 font-medium text-slate-500">
                        <button
                          onClick={() => handleSort("cycle")}
                          className="flex items-center space-x-1 hover:text-slate-700"
                        >
                          <span>Cycle</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="text-left p-3 font-medium text-slate-500">
                        <button
                          onClick={() => handleSort("start_date")}
                          className="flex items-center space-x-1 hover:text-slate-700"
                        >
                          <span>Date de début</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="text-left p-3 font-medium text-slate-500">
                        <button
                          onClick={() => handleSort("end_date")}
                          className="flex items-center space-x-1 hover:text-slate-700"
                        >
                          <span>Date de fin</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="text-left p-3 font-medium text-slate-500">
                        <button
                          onClick={() => handleSort("professor")}
                          className="flex items-center space-x-1 hover:text-slate-700"
                        >
                          <span>Professeur</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="text-right p-3 font-medium text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((ue) => (
                      <tr
                        key={ue.id}
                        className="border-b hover:bg-slate-50 transition-colors duration-150"
                      >
                        <td className="p-3 font-medium">{ue.ue.name}</td>
                        <td className="p-3">
                          {sections.find((s) => s.id === ue.ue.section)?.name ||
                            "N/A"}
                        </td>
                        <td className="p-3">Cycle {ue.ue.cycle}</td>
                        <td className="p-3">
                          {new Date(ue.start_date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {new Date(ue.end_date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {ue.professor
                            ? `${ue.professor.contactDetails.firstName} ${ue.professor.contactDetails.lastName}`
                            : "N/A"}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/academics-ue/lessons/${ue.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Leçons
                              </Button>
                            </Link>
                            <Link href={`/academics-ue/results/${ue.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                              >
                                <GraduationCap className="h-4 w-4 mr-1" />
                                Résultats
                              </Button>
                            </Link>
                            <Link href={`/academics-ue/register/${ue.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Inscriptions
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
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
                      year: year,
                      active_only: activeOnly ? "true" : undefined,
                    };
                    router.push(createUrlWithParams("/academics-ue", params));
                  }}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Aucune UE académique disponible
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
