import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AcademicUE {
    id: number;
    ue: string;
    year: number;
    startDate: string;
    endDate: string;
    professor?: string | null;
}

async function getAcademicUEs(): Promise<AcademicUE[]> {
    try {
        const response = await fetch("http://localhost:8000/ue-management/academic-ues/", {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch academic UEs:", error);
        return [];
    }
}

export default async function AcademicsUEPage() {
    const academicsData = await getAcademicUEs();

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Gestion des UE Académiques - Année {new Date().getFullYear()}</CardTitle>
                </CardHeader>
                <CardContent>
                    {academicsData.length > 0 ? (
                        <div className="mt-2 border rounded-md overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Nom</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date de début</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date de fin</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Professeur</th>
                                </tr>
                                </thead>
                                <tbody>
                                {academicsData.map((ue) => (
                                    <tr key={ue.id} className="border-t">
                                        <td className="px-4 py-2">{ue.id}</td>
                                        <td className="px-4 py-2">{ue.ue}</td>
                                        <td className="px-4 py-2">{new Date(ue.startDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{new Date(ue.endDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{ue.professor || "N/A"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-2 text-sm text-gray-500">Aucune UE disponible</p>
                    )}

                    <div className="mt-6 flex justify-end space-x-4">
                        <Link href="/ue-management/academics-ue/create">
                            <Button variant="outline">Créer une nouvelle UE</Button>
                        </Link>
                        <Link href="/ue-management/academics-ue">
                            <Button variant="outline">Retour à la liste des UE</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}