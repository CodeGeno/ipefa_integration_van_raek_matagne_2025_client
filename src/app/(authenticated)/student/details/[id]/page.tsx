"use client";

import { get } from "@/app/fetch";
import { Student } from "@/model/entity/users/student.entity";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Section } from "@/model/entity/ue/section.entity";
import DisplaySectionRegistration from "../section-registration";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Hash,
  MapPin,
  GraduationCap,
  BookOpen,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { AcademicUE } from "@/model/entity/ue/academic-ue.entity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UEResult {
  id: number;
  result: number;
  period: number;
  success: boolean;
  isExempt: boolean;
  approved: boolean;
}

const StudentDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student>();
  const [academicUEs, setAcademicUEs] = useState<AcademicUE[]>([]);
  const [ueResults, setUeResults] = useState<Record<string, UEResult[]>>({});
  const [displayMode, setDisplayMode] = useState<"none" | "section" | "ue">(
    "none"
  );
  const [isLoading, setIsLoading] = useState(true);

  const getStudent = async () => {
    try {
      const response = await get<Student>(`/security/student/${id}/`);
      if (response.success) {
        setStudent(response.data);
        // Récupérer les UE académiques de l'étudiant
        const ueResponse = await get<AcademicUE[]>(
          `/ue-management/academic-ues/student/${id}/`
        );
        if (ueResponse.success && ueResponse.data) {
          setAcademicUEs(ueResponse.data);
          // Récupérer les résultats pour chaque UE
          const resultsPromises = ueResponse.data.map(async (ue) => {
            const resultResponse = await get<{
              success: boolean;
              data: UEResult[];
            }>(`/ue-management/results/${ue.id}/${id}/`);
            if (resultResponse.success && resultResponse.data) {
              return [ue.id, resultResponse.data];
            }
            return [ue.id, []];
          });
          const results = await Promise.all(resultsPromises);
          setUeResults(Object.fromEntries(results));
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStudent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Détails de l'étudiant
            </h1>
            <p className="text-muted-foreground">
              Consultez et gérez les informations de l'étudiant
            </p>
          </div>
          <Link href="/student/list">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-background"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Informations personnelles
                  </CardTitle>
                  <CardDescription>
                    Détails de contact de l'étudiant
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Nom complet</span>
                    </div>
                    <p className="text-lg">
                      {`${student?.contactDetails.firstName} ${student?.contactDetails.lastName}`}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-lg">{student?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">Téléphone</span>
                    </div>
                    <p className="text-lg">
                      {student?.contactDetails.phoneNumber || "Non spécifié"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Hash className="h-4 w-4" />
                      <span className="text-sm font-medium">Matricule</span>
                    </div>
                    <p className="text-lg">
                      {student?.identifier || "Non spécifié"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Adresse</CardTitle>
                  <CardDescription>
                    Adresse de résidence de l'étudiant
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <span className="text-sm font-medium">Rue</span>
                    </div>
                    <p className="text-lg">
                      {student?.address?.street
                        ?.split(" ")
                        .slice(1)
                        .join(" ") || "Non spécifiée"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <span className="text-sm font-medium">Numéro</span>
                    </div>
                    <p className="text-lg">
                      {student?.address?.number || "Non spécifié"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <span className="text-sm font-medium">Ville</span>
                    </div>
                    <p className="text-lg">
                      {student?.address?.city || "Non spécifiée"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <span className="text-sm font-medium">Code postal</span>
                    </div>
                    <p className="text-lg">
                      {student?.address?.zipCode || "Non spécifié"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">UE académiques</CardTitle>
                  <CardDescription>
                    Liste des UE auxquelles l'étudiant est inscrit
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {academicUEs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UE</TableHead>
                      <TableHead>Année</TableHead>
                      <TableHead>Professeur</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Résultat</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicUEs.map((ue) => {
                      const results = ueResults[ue.id] || [];
                      const latestResult =
                        results.length > 0 ? results[results.length - 1] : null;

                      // Déterminer le statut
                      const getStatus = () => {
                        if (latestResult?.isExempt) return "Dispensé";
                        if (latestResult?.success) return "Réussi";
                        if (latestResult?.result !== undefined) return "Échoué";

                        const currentDate = new Date();
                        const startDate = new Date(ue.startDate);
                        const endDate = new Date(ue.endDate);

                        if (currentDate < startDate) return "À venir";
                        if (currentDate > endDate) return "Terminé";
                        return "En cours";
                      };

                      // Formater le résultat
                      const formatResult = () => {
                        if (!latestResult) return "Non disponible";
                        if (latestResult.isExempt) return "Dispensé";
                        const totalPoints = ue.ue.periods * 10;
                        return `${latestResult.result}/${totalPoints}`;
                      };

                      // Vérifier si l'étudiant est dans la liste des étudiants de l'UE
                      const isStudentEnrolled = ue.students?.some(
                        (student) => student.id === id
                      );

                      return (
                        <TableRow key={ue.id}>
                          <TableCell className="font-medium">
                            {ue.ue.name}
                          </TableCell>
                          <TableCell>{ue.cycleYear}</TableCell>
                          <TableCell>
                            {ue.professor
                              ? `${ue.professor.contactDetails.firstName} ${ue.professor.contactDetails.lastName}`
                              : "Non assigné"}
                          </TableCell>
                          <TableCell>{ue.ue.periods}</TableCell>
                          <TableCell>{formatResult()}</TableCell>
                          <TableCell>
                            <span
                              className={`${
                                getStatus() === "Réussi"
                                  ? "text-green-600"
                                  : getStatus() === "Échoué"
                                  ? "text-red-600"
                                  : getStatus() === "Dispensé"
                                  ? "text-blue-600"
                                  : getStatus() === "À venir"
                                  ? "text-blue-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {getStatus()}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    L'étudiant n'est inscrit à aucune UE académique
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
