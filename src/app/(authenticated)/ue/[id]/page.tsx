// src/app/(authenticated)/ue/[id]/page.tsx
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Lesson} from "@/model/entity/lessons/lesson.entity";
import {Student} from "@/model/entity/users/student.entity";


interface ParsedUE {
    id: number;
    ue: number;
    year: number;
    startDate: string;
    endDate: string;
    students: Student[];
    lessons: Lesson[];
}

async function getUE(id: string): Promise<ParsedUE | null> {
    try {
        const response = await fetch(`http://localhost:8000/api/ue/${id}/`, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Error fetching UE: ${response.status}`);
        }

        const responseData = await response.json();
        const item = responseData.data;

        if (!item) return null;

        return {
            id: item.id,
            ue: item.ue,
            year: item.year,
            startDate: item.start_date,
            endDate: item.end_date,
            students: item.students || [],
            lessons: item.lessons || []
        };
    } catch (error) {
        console.error("Error fetching UE details:", error);
        return null;
    }
}

export default async function UEDetailPage({params}: { params: { id: string } }) {
    const ue = await getUE(params.id);

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
                <CardHeader>
                    <CardTitle>Détails de l&apos;UE {ue.ue}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="text-lg font-medium">Informations générales</h3>
                            <div className="mt-2 space-y-2">
                                <p><span className="font-medium">Année:</span> {ue.year}</p>
                                <p><span
                                    className="font-medium">Date de début:</span> {new Date(ue.startDate).toLocaleDateString()}
                                </p>
                                <p><span
                                    className="font-medium">Date de fin:</span> {new Date(ue.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">Séances</h3>
                            {ue.lessons.length > 0 ? (
                                <div className="mt-2 border rounded-md overflow-hidden">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {ue.lessons.map((lesson) => (
                                            <tr key={lesson.lessonId} className="border-t">
                                                <td className="px-4 py-2">{lesson.lessonId}</td>
                                                <td className="px-4 py-2">{new Date(lesson.lessonDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-gray-500">Aucune séance programmée</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium">Étudiants inscrits</h3>
                        {ue.students.length > 0 ? (
                            <div className="mt-2 border rounded-md overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Nom</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {ue.students.map((student: Student) => (
                                        <tr key={student.accountId || student.accountId} className="border-t">
                                            <td className="px-4 py-2">{student.accountId || student.accountId}</td>
                                            <td className="px-4 py-2">
                                                `${student.contactDetails.firstName} ${student.contactDetails.lastName}`
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-gray-500">Aucun étudiant inscrit</p>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <Link href={`/ue/update/${ue.id}`}>
                            <Button variant="outline">
                                Modifier
                            </Button>
                        </Link>
                        <Link href="/ue">
                            <Button variant="outline">
                                Retour à la liste
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}