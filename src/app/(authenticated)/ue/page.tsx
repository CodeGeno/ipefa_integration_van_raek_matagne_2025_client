"use client";

// src/app/(authenticated)/ue/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Section } from "@/model/entity/ue/section.entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import { UE } from "@/model/entity/ue/ue.entity";
import { DeleteUEDialog } from "@/components/ue/delete-ue-dialog";
import { ActivateUEButton } from "@/components/ue/activate-ue-button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface ApiSectionItem {
  id: number;
  sectionId: number;
  name: string;
  sectionType: string;
  sectionCategory: string;
  description: string;
}

async function getSections(): Promise<Section[]> {
  try {
    const response = await fetch("http://localhost:8000/api/section/list/", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error fetching sections: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData.data.map((item: ApiSectionItem) => ({
      id: item.id,
      sectionId: item.sectionId,
      name: item.name,
      sectionType: item.sectionType,
      sectionCategory: item.sectionCategory,
      description: item.description,
    }));
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

async function getUEs(): Promise<UE[]> {
  try {
    const response = await fetch("http://localhost:8000/api/ue/list/", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error fetching UEs: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.data || [];
  } catch (error) {
    console.error("Error fetching UEs:", error);
    return [];
  }
}

export default function UEListPage() {
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [ues, setUEs] = useState<UE[]>([]);

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      const [sectionsData, uesData] = await Promise.all([
        getSections(),
        getUEs(),
      ]);
      setSections(sectionsData);
      setUEs(uesData);
    };
    loadData();
  }, []);

  // Handle UE deletion
  const handleDelete = (ueId: number) => {
    setUEs((currentUEs) => currentUEs.filter((ue) => ue.ueId !== ueId));
  };

  // Handle UE activation
  const handleActivate = (ueId: number) => {
    setUEs((currentUEs) =>
      currentUEs.map((ue) =>
        ue.ueId === ueId ? { ...ue, isActive: true } : ue
      )
    );
  };

  // Group UEs by section and then by cycle
  const uesBySection: Record<number, Record<number, UE[]>> = {};

  sections.forEach((section) => {
    uesBySection[section.sectionId] = {};
  });

  ues.forEach((ue) => {
    if (!uesBySection[ue.section]) {
      uesBySection[ue.section] = {};
    }

    if (!uesBySection[ue.section][ue.cycle]) {
      uesBySection[ue.section][ue.cycle] = [];
    }

    // Only add the UE if it's active or if we're showing all UEs
    if (ue.isActive || !showActiveOnly) {
      uesBySection[ue.section][ue.cycle].push(ue);
    }
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des UEs</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="active-filter"
              checked={showActiveOnly}
              onCheckedChange={setShowActiveOnly}
            />
            <Label htmlFor="active-filter">UEs actives uniquement</Label>
          </div>
          <Link href="/ue/create">
            <Button>+ Ajouter une UE</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          // Skip sections with no UEs
          if (
            !uesBySection[section.sectionId] ||
            Object.keys(uesBySection[section.sectionId]).length === 0
          ) {
            return null;
          }

          // Get cycles for this section and sort them
          const cycles = Object.keys(uesBySection[section.sectionId])
            .map(Number)
            .sort((a, b) => a - b);

          return (
            <Collapsible key={section.sectionId} className="w-full">
              <Card>
                <CollapsibleTrigger className="w-full focus:outline-none">
                  <CardHeader className="bg-slate-100 hover:bg-slate-200 cursor-pointer flex flex-row justify-between items-center">
                    <CardTitle className="text-xl font-bold">
                      Section: {section.name}
                    </CardTitle>
                    <ChevronDown className="h-5 w-5" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {cycles.map((cycle) => {
                        const cycleUes =
                          uesBySection[section.sectionId][cycle] || [];

                        return (
                          <Collapsible key={cycle} className="w-full">
                            <Card>
                              <CollapsibleTrigger className="w-full focus:outline-none">
                                <CardHeader className="bg-slate-50 hover:bg-slate-100 cursor-pointer flex flex-row justify-between items-center">
                                  <CardTitle className="text-lg">
                                    Cycle {cycle} ({cycleUes.length} UEs)
                                  </CardTitle>
                                  <ChevronDown className="h-4 w-4" />
                                </CardHeader>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="p-0">
                                  <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                      <thead>
                                        <tr className="bg-slate-100">
                                          <th className="px-4 py-2 text-left">
                                            ID
                                          </th>
                                          <th className="px-4 py-2 text-left">
                                            Nom
                                          </th>
                                          <th className="px-4 py-2 text-left">
                                            Description
                                          </th>
                                          <th className="px-4 py-2 text-center">
                                            Périodes
                                          </th>
                                          <th className="px-4 py-2 text-center">
                                            État
                                          </th>
                                          <th className="px-4 py-2 text-right">
                                            Actions
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {cycleUes.map((ue) => (
                                          <tr
                                            key={ue.ueId}
                                            className={`border-t hover:bg-slate-50 ${
                                              !ue.isActive ? "bg-slate-50" : ""
                                            }`}
                                          >
                                            <td className="px-4 py-3">
                                              {ue.ueId}
                                            </td>
                                            <td className="px-4 py-3">
                                              {ue.name}
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate">
                                              {ue.description}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              {ue.periods}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              {ue.isActive ? (
                                                <div className="flex items-center justify-center text-green-600">
                                                  <CheckCircle2 className="h-5 w-5 mr-1" />
                                                  <span>Active</span>
                                                </div>
                                              ) : (
                                                <div className="flex items-center justify-center text-red-600">
                                                  <XCircle className="h-5 w-5 mr-1" />
                                                  <span>Inactive</span>
                                                </div>
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                              <div className="flex justify-end space-x-2">
                                                <Link href={`/ue/${ue.ueId}`}>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                  >
                                                    Voir
                                                  </Button>
                                                </Link>
                                                <Link
                                                  href={`/ue/update/${ue.ueId}`}
                                                >
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                  >
                                                    Modifier
                                                  </Button>
                                                </Link>
                                                {ue.isActive ? (
                                                  <DeleteUEDialog
                                                    ueId={ue.ueId}
                                                    ueName={ue.name}
                                                    onDelete={handleDelete}
                                                  />
                                                ) : (
                                                  <ActivateUEButton
                                                    ueId={ue.ueId}
                                                    ueName={ue.name}
                                                    onActivate={handleActivate}
                                                  />
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </CardContent>
                              </CollapsibleContent>
                            </Card>
                          </Collapsible>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
