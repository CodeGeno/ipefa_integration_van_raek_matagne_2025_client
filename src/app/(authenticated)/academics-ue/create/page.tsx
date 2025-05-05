import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface UEOption {
    id: number;
    name: string;
    section: string;
}

interface Professor {
    id: number;
    firstName: string;
    lastName: string;
}

async function getUEOptions(): Promise<UEOption[]> {
    try {
        const response = await fetch("http://localhost:8000/ue-management/ues", {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Error fetching UEs: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch UEs:", error);
        return [];
    }
}

async function getProfessors(): Promise<Professor[]> {
    try {
        const response = await fetch("http://localhost:8000/users/professors", {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Error fetching professors: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch professors:", error);
        return [];
    }
}

export default async function CreateAcademicUEPage() {
    const ueOptions = await getUEOptions();
    const professors = await getProfessors();
    const currentYear = new Date().getFullYear();

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <Link href="/ue-management/academics-ue" className="flex items-center text-sm text-gray-500 mb-2">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Retour à la liste
                        </Link>
                        <CardTitle>Créer une nouvelle UE académique</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form action="/api/academic-ues/create" method="POST" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ue">Unité d&apos;enseignement</Label>
                                <Select name="ueId" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une UE" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ueOptions.map((ue) => (
                                            <SelectItem key={ue.id} value={ue.id.toString()}>
                                                {ue.name} ({ue.section})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="professor">Professeur</Label>
                                <Select name="professorId">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un professeur (optionnel)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {professors.map((prof: Professor) => (
                                            <SelectItem key={prof.id} value={prof.id.toString()}>
                                                {prof.firstName} {prof.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="year">Année académique</Label>
                                <Select name="year" defaultValue={currentYear.toString()} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une année" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={(currentYear-1).toString()}>{currentYear-1}</SelectItem>
                                        <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                                        <SelectItem value={(currentYear+1).toString()}>{currentYear+1}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startDate">Date de début</Label>
                                <div className="grid gap-2">

                                    <input type="hidden" name="startDate" id="startDate-hidden" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">Date de fin</Label>
                                <div className="grid gap-2">

                                    <input type="hidden" name="endDate" id="endDate-hidden" />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Description (optionnelle)</Label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <Link href="/ue-management/academics-ue">
                                <Button variant="outline" type="button">Annuler</Button>
                            </Link>
                            <Button type="submit">Créer l&apos;UE académique</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}