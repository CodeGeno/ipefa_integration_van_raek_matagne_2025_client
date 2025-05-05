import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { PlusCircle, ClipboardList, Users } from "lucide-react";
import React from "react";

interface AcademicUE {
    id: number;
    ue: string;
    year: number;
    section?: string;
    startDate: string;
    endDate: string;
    professor?: string | null;
    studentsCount?: number;
    lessonsCount?: number;
}

async function getAcademicUEs(): Promise<AcademicUE[]> {
    try {
        const response = await fetch("http://localhost:8000/ue-management/academic-ues/", {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        const data = await response.json();

        // Group by section if needed
        // This is a placeholder - your API might already return this data
        return data.map((ue: AcademicUE) => ({
            id: ue.id,
            ue: ue.ue,
            year: ue.year,
            section: ue.section || "Section non spécifiée",
            startDate: ue.startDate,
            endDate: ue.endDate,
            professor: ue.professor,
            studentsCount: ue.studentsCount || 0,
            lessonsCount: ue.lessonsCount || 0
        }));
    } catch (error) {
        console.error("Failed to fetch academic UEs:", error);
        return [];
    }
}

export default async function AcademicsUEPage() {
    const academicUEs = await getAcademicUEs();

    // Group UEs by section
    const groupedBySection = academicUEs.reduce((acc: Record<string, AcademicUE[]>, ue) => {
        const section = ue.section || "Non catégorisé";
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(ue);
        return acc;
    }, {});

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion des UE Académiques - Année {new Date().getFullYear()}</CardTitle>
                    <Link href="/academics-ue/create">
                        <Button className="ml-2">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Nouvelle UE
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="sections" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="sections">Par section</TabsTrigger>
                            <TabsTrigger value="all">Toutes les UEs</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sections">
                            {Object.keys(groupedBySection).length > 0 ? (
                                Object.entries(groupedBySection).map(([section, ues]) => (
                                    <div key={section} className="mb-6">
                                        <h3 className="text-lg font-medium mb-2">{section}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {ues.map((ue) => (
                                                <Link href={`/ue-management/academics-ue/${ue.id}`} key={ue.id}>
                                                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                                        <CardContent className="p-4">
                                                            <h4 className="font-semibold text-md">{ue.ue}</h4>
                                                            <div className="text-sm text-gray-500 mt-2">
                                                                <p>Professeur: {ue.professor || "Non assigné"}</p>
                                                                <p>Période: {new Date(ue.startDate).toLocaleDateString()} - {new Date(ue.endDate).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-3 text-sm">
                                                                <div className="flex items-center" title="Étudiants">
                                                                    <Users className="h-4 w-4 mr-1" />
                                                                    <span>{ue.studentsCount}</span>
                                                                </div>
                                                                <div className="flex items-center" title="Séances">
                                                                    <ClipboardList className="h-4 w-4 mr-1" />
                                                                    <span>{ue.lessonsCount}</span>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Aucune UE disponible</p>
                            )}
                        </TabsContent>

                        <TabsContent value="all">
                            <div className="border rounded-md overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Nom</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Section</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Période</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Professeur</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {academicUEs.map((ue) => (
                                        <tr key={ue.id} className="border-t">
                                            <td className="px-4 py-2">{ue.id}</td>
                                            <td className="px-4 py-2 font-medium">{ue.ue}</td>
                                            <td className="px-4 py-2">{ue.section}</td>
                                            <td className="px-4 py-2">{new Date(ue.startDate).toLocaleDateString()} - {new Date(ue.endDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{ue.professor || "N/A"}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex space-x-2">
                                                    <Link href={`/academics-ue/${ue.id}`}>
                                                        <Button size="sm" variant="outline">Détails</Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}