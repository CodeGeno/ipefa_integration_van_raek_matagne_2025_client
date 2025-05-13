"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/model/entity/ue/section.entity";
import { UE } from "@/model/entity/ue/ue.entity";
import { ArrowLeft, BookOpen, GraduationCap, Clock } from "lucide-react";
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

interface SectionDetailsContentProps {
  section: Section;
}

export default function SectionDetailsContent({
  section,
}: SectionDetailsContentProps) {
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Périodes</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.ues.map((ue: UE) => (
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
