"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/model/entity/ue/section.entity";
import { UE } from "@/model/entity/ue/ue.entity";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Clock,
  ArrowUpDown,
  Search,
} from "lucide-react";
import Link from "next/link";
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SectionDetailsContentProps {
  section: Section;
}

export default function SectionDetailsContent({
  section,
}: SectionDetailsContentProps) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchInput, setSearchInput] = useState("");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAndFilteredUEs = section.ues
    ? [...section.ues]
        .filter((ue) => {
          if (!searchInput) return true;
          return (
            ue.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            (ue.description &&
              ue.description.toLowerCase().includes(searchInput.toLowerCase()))
          );
        })
        .sort((a, b) => {
          if (!sortField) return 0;

          let valueA, valueB;

          switch (sortField) {
            case "name":
              valueA = a.name.toLowerCase();
              valueB = b.name.toLowerCase();
              break;
            case "description":
              valueA = (a.description || "").toLowerCase();
              valueB = (b.description || "").toLowerCase();
              break;
            case "cycle":
              valueA = a.cycle;
              valueB = b.cycle;
              break;
            case "periods":
              valueA = a.periods;
              valueB = b.periods;
              break;
            case "status":
              valueA = a.isActive ? "active" : "inactive";
              valueB = b.isActive ? "active" : "inactive";
              break;
            default:
              return 0;
          }

          if (sortDirection === "asc") {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
        })
    : [];

  // Fonction pour récupérer le libellé de l&apos;enum SectionType
  const getSectionTypeLabel = (type: SectionTypeEnum): string => {
    const sectionTypeKey = Object.keys(SectionTypeEnum).find(
      (key) => SectionTypeEnum[key as keyof typeof SectionTypeEnum] === type
    );
    return sectionTypeKey
      ? SectionTypeEnum[sectionTypeKey as keyof typeof SectionTypeEnum]
      : type?.toString() || "N/A";
  };

  // Fonction pour récupérer le libellé de l&apos;enum SectionCategory
  const getSectionCategoryLabel = (category: SectionCategoryEnum): string => {
    const sectionCategoryKey = Object.keys(SectionCategoryEnum).find(
      (key) =>
        SectionCategoryEnum[key as keyof typeof SectionCategoryEnum] ===
        category
    );
    return sectionCategoryKey
      ? SectionCategoryEnum[
          sectionCategoryKey as keyof typeof SectionCategoryEnum
        ]
      : category?.toString() || "N/A";
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{section.name}</h1>
          <p className="text-muted-foreground">
            Détails de la section et ses unités d&apos;enseignement
          </p>
        </div>
        <Link href="/section/list">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-slate-500" />
              <span className="font-medium">Type de section:</span>
              <span>{getSectionTypeLabel(section.sectionType)}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-500" />
              <span className="font-medium">Catégorie:</span>
              <span>{getSectionCategoryLabel(section.sectionCategory)}</span>
            </div>
            {section.description && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-slate-600">{section.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-500">
                  Unités d&apos;enseignement
                </h3>
                <p className="text-2xl font-bold mt-1">
                  {section.ues?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unités d&apos;enseignement</CardTitle>
        </CardHeader>
        <CardContent>
          {section.ues && section.ues.length > 0 ? (
            <>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une UE..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Nom
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("description")}
                    >
                      <div className="flex items-center">
                        Description
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("cycle")}
                    >
                      <div className="flex items-center">
                        Cycle
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("periods")}
                    >
                      <div className="flex items-center">
                        Périodes
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Statut
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredUEs.map((ue: UE) => (
                    <TableRow key={ue.id}>
                      <TableCell className="font-medium">{ue.name}</TableCell>
                      <TableCell>{ue.description || "-"}</TableCell>
                      <TableCell>Cycle {ue.cycle}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-500" />
                        {ue.periods}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={ue.isActive ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {ue.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/ue/${ue.id}`}>
                          <Button variant="outline" size="sm">
                            Voir détails
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <p className="text-center py-6 text-muted-foreground">
              Aucune unité d&apos;enseignement dans cette section
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}