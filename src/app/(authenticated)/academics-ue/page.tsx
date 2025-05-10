"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { get } from "@/app/fetch";
import { useState, useEffect } from "react";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { UE } from "@/model/entity/ue/ue.entity";

interface AcademicUE {
  id: number;
  ue: UE;
  year: number;
  start_date: string;
  end_date: string;
  professor?: Employee | null;
}

export default function AcademicsUEPage() {
  const [academicsData, setAcademicsData] = useState<AcademicUE[]>([]);

  const getAcademicUEs = async () => {
    try {
      console.log("Fetching academic UEs");
      const response = await get<AcademicUE[]>("/ue-management/academic-ues/");

      if (!response.success) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      console.log(response.data);
      setAcademicsData(response.data as AcademicUE[]);
    } catch (error) {
      console.error("Failed to fetch academic UEs:", error);
    }
  };

  useEffect(() => {
    getAcademicUEs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Gestion des UE Académiques - Année {new Date().getFullYear()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {academicsData.length > 0 ? (
            <div className="mt-2 border rounded-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Nom
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Date de début
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Date de fin
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Professeur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {academicsData.map((ue) => {
                    console.log(ue);
                    return (
                      <tr key={ue.id} className="border-t">
                        <td className="px-4 py-2">{ue.id}</td>
                        <td className="px-4 py-2">{ue.ue.name}</td>
                        <td className="px-4 py-2">
                          {new Date(ue.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(ue.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {ue.professor
                            ? `${ue.professor.contactDetails.firstName} ${ue.professor.contactDetails.lastName}`
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Aucune UE disponible</p>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <Link href="academics-ue/create">
              <Button variant="outline">Créer une nouvelle UE</Button>
            </Link>
            <Link href="academics-ue/">
              <Button variant="outline">Retour à la liste des UE</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
