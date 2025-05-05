// src/app/(authenticated)/ue/page.tsx
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Section} from "@/model/entity/ue/section.entity";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {ChevronDown} from "lucide-react";
import {UE} from "@/model/entity/ue/ue.entity";

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
            cache: "no-store"
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
            description: item.description
        }));
    } catch (error) {
        console.error("Error fetching sections:", error);
        return [];
    }
}

async function getUEs(): Promise<UE[]> {
    try {
        const response = await fetch("http://localhost:8000/api/ue/list/", {
            cache: "no-store"
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

export default async function UEListPage() {
    const [sections, ues] = await Promise.all([
        getSections(),
        getUEs()
    ]);

    // Group UEs by section and then by cycle
    const uesBySection: Record<number, Record<number, UE[]>> = {};

    sections.forEach(section => {
        uesBySection[section.sectionId] = {};
    });

    ues.forEach(ue => {
        if (!uesBySection[ue.section]) {
            uesBySection[ue.section] = {};
        }

        if (!uesBySection[ue.section][ue.cycle]) {
            uesBySection[ue.section][ue.cycle] = [];
        }

        uesBySection[ue.section][ue.cycle].push(ue);
    });

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des UEs</h1>
                <Link href="/ue/create">
                    <Button>+ Ajouter une UE</Button>
                </Link>
            </div>

            <div className="space-y-6">
                {sections.map(section => {
                    // Skip sections with no UEs
                    if (!uesBySection[section.sectionId] || Object.keys(uesBySection[section.sectionId]).length === 0) {
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
                                    <CardHeader
                                        className="bg-slate-100 hover:bg-slate-200 cursor-pointer flex flex-row justify-between items-center">
                                        <CardTitle className="text-xl font-bold">
                                            Section: {section.name}
                                        </CardTitle>
                                        <ChevronDown className="h-5 w-5"/>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            {cycles.map(cycle => {
                                                const cycleUes = uesBySection[section.sectionId][cycle] || [];

                                                return (
                                                    <Collapsible key={cycle} className="w-full">
                                                        <Card>
                                                            <CollapsibleTrigger className="w-full focus:outline-none">
                                                                <CardHeader
                                                                    className="bg-slate-50 hover:bg-slate-100 cursor-pointer flex flex-row justify-between items-center">
                                                                    <CardTitle className="text-lg">
                                                                        Cycle {cycle} ({cycleUes.length} UEs)
                                                                    </CardTitle>
                                                                    <ChevronDown className="h-4 w-4"/>
                                                                </CardHeader>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent>
                                                                <CardContent className="p-0">
                                                                    <div className="overflow-x-auto">
                                                                        <table className="w-full border-collapse">
                                                                            <thead>
                                                                            <tr className="bg-slate-100">
                                                                                <th className="px-4 py-2 text-left">ID</th>
                                                                                <th className="px-4 py-2 text-left">Nom</th>
                                                                                <th className="px-4 py-2 text-left">Description</th>
                                                                                <th className="px-4 py-2 text-center">Périodes</th>
                                                                                <th className="px-4 py-2 text-right">Actions</th>
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                            {cycleUes.map(ue => (
                                                                                <tr key={ue.ueId}
                                                                                    className="border-t hover:bg-slate-50">
                                                                                    <td className="px-4 py-3">{ue.ueId}</td>
                                                                                    <td className="px-4 py-3">{ue.name}</td>
                                                                                    <td className="px-4 py-3 max-w-xs truncate">{ue.description}</td>
                                                                                    <td className="px-4 py-3 text-center">{ue.periods}</td>
                                                                                    <td className="px-4 py-3 text-right">
                                                                                        <div
                                                                                            className="flex justify-end space-x-2">
                                                                                            <Link
                                                                                                href={`/ue/${ue.ueId}`}>
                                                                                                <Button
                                                                                                    variant="outline"
                                                                                                    size="sm">
                                                                                                    Voir
                                                                                                </Button>
                                                                                            </Link>
                                                                                            <Link
                                                                                                href={`/ue/update/${ue.ueId}`}>
                                                                                                <Button
                                                                                                    variant="outline"
                                                                                                    size="sm">
                                                                                                    Modifier
                                                                                                </Button>
                                                                                            </Link>
                                                                                            <Button
                                                                                                variant="destructive"
                                                                                                size="sm">
                                                                                                Supprimer
                                                                                            </Button>
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