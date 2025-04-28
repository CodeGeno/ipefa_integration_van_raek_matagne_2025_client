// src/app/(authenticated)/ue/list/page.tsx
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {AcademicUE} from "@/model/entity/ue/academic-ue.entity";
import {Student} from "@/model/entity/users/student.entity";
import {Section} from "@/model/entity/ue/section.entity";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {ChevronDown} from "lucide-react";
import {UE} from "@/model/entity/ue/ue.entity";

interface ApiUEItem {
    id: number;
    ue: {
        id: number;
        code: string;
        section: number;
    };
    year: number;
    start_date: string;
    end_date: string;
    students: Student[];
    lessons: {
        id: number;
        lesson_date: string;
        academic_ue: number;
    }[];
}

interface ApiSectionItem {
    id: number;
    sectionId: number;
    name: string;
    sectionType: string;
    sectionCategory: string;
    description: string;
    ues: UE[];
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

        console.log(responseData);
        // Extract the data array from the API response
        return responseData.data.map((item: ApiSectionItem) => ({
            id: item.id,
            sectionId: item.sectionId,
            name: item.name,
            sectionType: item.sectionType,
            sectionCategory: item.sectionCategory,
            description: item.description,
            ues: item.ues || []
        }));
    } catch (error) {
        console.error("Error fetching sections:", error);
        return [];
    }
}

async function getAcademicUEs(): Promise<AcademicUE[]> {
    try {
        const response = await fetch("http://localhost:8000/api/ue-management/academic-ues/", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Error fetching UEs: ${response.status}`);
        }

        const responseData = await response.json();

        // Extract the data array from the API response and handle the nested UE structure
        return responseData.data.map((item: ApiUEItem) => ({
            id: item.id,
            academicUeId: item.id,
            ue: item.ue,
            sectionId: item.ue.section,
            year: item.year,
            code: item.ue.code || `UE-${item.ue.id}`,
            startDate: item.start_date,
            endDate: item.end_date,
            students: item.students || [],
            lessons: item.lessons || []
        }));
    } catch (error) {
        console.error("Error fetching UEs:", error);
        return [];
    }
}

export default async function UEListPage() {
    const [sections, ues] = await Promise.all([
        getSections(),
        getAcademicUEs()
    ]);

    // Group UEs by section and then by year
    const uesBySection: Record<number, Record<number, AcademicUE[]>> = {};

    sections.forEach(section => {
        uesBySection[section.sectionId] = {};
    });

    ues.forEach(ue => {
        const sectionId = ue.academicUeId || 1;
        if (!uesBySection[sectionId]) {
            uesBySection[sectionId] = {};
        }

        if (!uesBySection[sectionId][ue.year]) {
            uesBySection[sectionId][ue.year] = [];
        }

        uesBySection[sectionId][ue.year].push(ue);
    });

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
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

                    // Get years for this section and sort them
                    const years = Object.keys(uesBySection[section.sectionId])
                        .map(Number)
                        .sort((a, b) => b - a);

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
                                            <div className="pl-4 space-y-4">
                                                {years.map(year => {
                                                    const yearUes = uesBySection[section.sectionId][year] || [];

                                                    return (
                                                        <Collapsible key={year} className="w-full">
                                                            <Card>
                                                                <CollapsibleTrigger
                                                                    className="w-full focus:outline-none">
                                                                    <CardHeader
                                                                        className="bg-slate-50 hover:bg-slate-100 cursor-pointer flex flex-row justify-between items-center">
                                                                        <CardTitle className="text-lg">
                                                                            Année {year} ({yearUes.length} UEs)
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
                                                                                    <th className="px-4 py-2 text-left">Nom</th>
                                                                                    <th className="px-4 py-2 text-left">Période</th>
                                                                                    <th className="px-4 py-2 text-center">Étudiants</th>
                                                                                    <th className="px-4 py-2 text-center">Séances</th>
                                                                                    <th className="px-4 py-2 text-right">Actions</th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {yearUes.map(ue => (
                                                                                    <tr key={ue.academicUeId}
                                                                                        className="border-t hover:bg-slate-50">
                                                                                        <td className="px-4 py-3">{ue.ue.name}</td>
                                                                                        <td className="px-4 py-3">
                                                                                            {new Date(ue.startDate).toLocaleDateString()} - {new Date(ue.endDate).toLocaleDateString()}
                                                                                        </td>
                                                                                        <td className="px-4 py-3 text-center">
                                                                                            <span
                                                                                                className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800">
                                                                                                {ue.students.length}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="px-4 py-3 text-center">
                                                                                            <span
                                                                                                className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800">
                                                                                                {ue.lessons.length}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="px-4 py-3 text-right">
                                                                                            <div
                                                                                                className="flex justify-end space-x-2">
                                                                                                <Link
                                                                                                    href={`/ue/${ue.ue.ueId}`}>
                                                                                                    <Button
                                                                                                        variant="outline"
                                                                                                        size="sm">
                                                                                                        Voir
                                                                                                    </Button>
                                                                                                </Link>
                                                                                                <Link
                                                                                                    href={`/ue/edit/${ue.ue.ueId}`}>
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