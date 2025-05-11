// src/app/(authenticated)/ue/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteUEDialog } from "@/components/ue/delete-ue-dialog";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  XCircle,
} from "lucide-react";
import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/app/fetch";
import { toast } from "@/hooks/use-toast";

interface Section {
  sectionId: number;
  name: string;
}

interface ParsedUE {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  section: number;
  prerequisites: number[];
  cycle: number;
  periods: number;
}

async function getSection(id: number): Promise<Section | null> {
  try {
    const response = await get<Section>(`/section/${id}/`);
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching section details:", error);
    return null;
  }
}

async function getUE(id: string): Promise<ParsedUE | null> {
  try {
    const response = await get<ParsedUE>(`/ue/${id}/`);
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les détails de l'UE",
      variant: "destructive",
    });
    return null;
  }
}

function UEDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [ue, setUE] = useState<ParsedUE | null>(null);
  const [section, setSection] = useState<Section | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      const ueData = await getUE(id);
      setUE(ueData);
      if (ueData) {
        const sectionData = await getSection(ueData.section);
        setSection(sectionData);
      }
    };
    loadData();
  }, [id]);

  const handleDelete = () => {
    router.push("/ue");
  };

  if (!ue) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>UE non trouvée</p>
              <Link href="/ue">
                <Button className="mt-4">Retour à la liste</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Détails de l'UE</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consultez les informations détaillées de l'unité d'enseignement
          </p>
        </div>
        <Link href="/ue">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{ue.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {section ? section.name : "Section non trouvée"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {ue.isActive ? (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Active</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full">
                <XCircle className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Inactive</span>
              </div>
            )}
            <DeleteUEDialog
              ueId={ue.id}
              ueName={ue.name}
              onDelete={handleDelete}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Informations générales
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-muted-foreground">
                      Nom
                    </span>
                    <span className="text-sm">{ue.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-muted-foreground">
                      Description
                    </span>
                    <span className="text-sm">
                      {ue.description || "Non spécifiée"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-muted-foreground">
                      Cycle
                    </span>
                    <span className="text-sm">Cycle {ue.cycle}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-muted-foreground">
                      Périodes
                    </span>
                    <span className="text-sm flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      {ue.periods}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {ue.prerequisites.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Prérequis
                </h3>
                <div className="mt-4">
                  <ul className="space-y-2">
                    {ue.prerequisites.map((prereq: number) => (
                      <li
                        key={prereq}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        UE {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Link href={`/ue/update/${ue.id}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Modifier
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UEDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return <UEDetailContent id={resolvedParams.id} />;
}
