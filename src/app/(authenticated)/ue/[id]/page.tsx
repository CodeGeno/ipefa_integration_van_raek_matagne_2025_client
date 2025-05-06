// src/app/(authenticated)/ue/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteUEDialog } from "@/components/ue/delete-ue-dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Section {
  sectionId: number;
  name: string;
}

interface ParsedUE {
  ueId: number;
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
    const response = await fetch(`http://localhost:8000/api/section/${id}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error fetching section: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.data || null;
  } catch (error) {
    console.error("Error fetching section details:", error);
    return null;
  }
}

async function getUE(id: string): Promise<ParsedUE | null> {
  try {
    const response = await fetch(`http://localhost:8000/api/ue/${id}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error fetching UE: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.data || null;
  } catch (error) {
    console.error("Error fetching UE details:", error);
    return null;
  }
}

export default function UEDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [ue, setUE] = useState<ParsedUE | null>(null);
  const [section, setSection] = useState<Section | null>(null);

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      const ueData = await getUE(params.id);
      setUE(ueData);
      if (ueData) {
        const sectionData = await getSection(ueData.section);
        setSection(sectionData);
      }
    };
    loadData();
  }, [params.id]);

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {ue.name} - {section ? section.name : "Section non trouvée"}
          </CardTitle>
          <div className="flex items-center gap-4">
            {ue.isActive ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" />
                <span>Active</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" />
                <span>Inactive</span>
              </div>
            )}
            <DeleteUEDialog
              ueId={ue.ueId}
              ueName={ue.name}
              onDelete={handleDelete}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium">Informations générales</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Nom:</span> {ue.name}
                </p>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {ue.description || "Non spécifiée"}
                </p>
                <p>
                  <span className="font-medium">Cycle:</span> {ue.cycle}
                </p>
                <p>
                  <span className="font-medium">Périodes:</span> {ue.periods}
                </p>
              </div>
            </div>

            {ue.prerequisites.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Prérequis</h3>
                <div className="mt-2">
                  <ul className="list-disc list-inside">
                    {ue.prerequisites.map((prereq: number) => (
                      <li key={prereq}>UE {prereq}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Link href={`/ue/update/${ue.ueId}`}>
              <Button variant="outline">Modifier</Button>
            </Link>
            <Link href="/ue">
              <Button variant="outline">Retour à la liste</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
