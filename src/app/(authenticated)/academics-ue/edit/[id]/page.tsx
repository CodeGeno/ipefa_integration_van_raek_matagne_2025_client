"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { get, patch } from "@/app/fetch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AccountContext } from "@/app/context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { use } from "react";

interface AcademicUE {
  id: number;
  ue: {
    id: number;
    name: string;
    periods: number;
  };
  year: number;
  professor: Professor | null;
  start_date?: string;
  end_date?: string;
}

interface Professor {
  id: number;
  role: string;
  contactDetails: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
  };
  address: {
    id: number;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    number: string;
    complement: string;
    state: string;
  };
  email: string;
  matricule: string;
}

export default function EditAcademicUEPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [academicUE, setAcademicUE] = useState<AcademicUE | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] =
    useState<string>("none");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { accountData, handleUnauthorized } = useContext(AccountContext);

  useEffect(() => {
    // Vérifier si l'utilisateur est un administrateur
    if (accountData.role !== "ADMINISTRATOR") {
      toast.error("Accès refusé", {
        description: "Vous n'êtes pas autorisé à accéder à cette page",
        duration: 5000,
      });
      handleUnauthorized();
      return;
    }

    const fetchData = async () => {
      try {
        console.log(
          `Fetching academic UE details from: /ue-management/academic-ues/${resolvedParams.id}/`
        );
        // Try the first endpoint (AcademicUEDetailView)
        let academicUEResponse = await get<AcademicUE>(
          `/ue-management/academic-ues/${resolvedParams.id}/`
        );

        // If the first endpoint fails, try the alternative endpoint
        if (!academicUEResponse.success || !academicUEResponse.data) {
          console.log(
            `First endpoint failed, trying alternative: /ue-management/academic-ues/${resolvedParams.id}/details/`
          );
          academicUEResponse = await get<AcademicUE>(
            `/ue-management/academic-ues/${resolvedParams.id}/details/`
          );
        }

        if (!academicUEResponse.success || !academicUEResponse.data) {
          throw new Error(
            "Failed to fetch academic UE details from both endpoints"
          );
        }

        setAcademicUE(academicUEResponse.data);

        // Set the initial selected professor if there is one
        if (academicUEResponse.data?.professor) {
          setSelectedProfessorId(
            academicUEResponse.data.professor.id.toString()
          );
        } else {
          setSelectedProfessorId("none");
        }

        // Fetch the list of professors
        const professorsResponse = await get<Professor[]>(
          "/security/employee/teacher/list/"
        );
        if (!professorsResponse.success || !professorsResponse.data) {
          throw new Error("Failed to fetch professors list");
        }
        setProfessors(professorsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur", {
          description:
            "Impossible de récupérer les données. Veuillez réessayer.",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, accountData.role, handleUnauthorized]);

  const handleSubmit = async () => {
    if (!academicUE) return;

    setIsSubmitting(true);
    try {
      // Prepare the data for update - we only update the professor_id field
      const updateData = {
        professor_id:
          selectedProfessorId && selectedProfessorId !== "none"
            ? parseInt(selectedProfessorId)
            : null,
      };

      console.log("Envoi des données:", updateData);

      // Send the update request using the AcademicUEDetailView endpoint
      const response = await patch(
        `/ue-management/academic-ues/${academicUE.id}/`,
        updateData
      );

      console.log("Réponse reçue:", response);

      if (response.success) {
        // Message personnalisé en fonction de l'action effectuée
        let successMessage = "";

        if (selectedProfessorId === "none") {
          successMessage = `Le professeur a été retiré de l'UE "${academicUE.ue.name}"`;
        } else {
          const selectedProf = professors.find(
            (p) => p.id.toString() === selectedProfessorId
          );
          if (selectedProf) {
            successMessage = `${selectedProf.contactDetails.firstName} ${selectedProf.contactDetails.lastName} a été assigné à l'UE "${academicUE.ue.name}"`;
          } else {
            successMessage = `Le professeur a été mis à jour avec succès`;
          }
        }

        toast.success("Modification réussie", {
          description: successMessage,
          duration: 3000,
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });

        // Délai avant redirection
        setTimeout(() => {
          router.push("/academics-ue");
        }, 1500);
      } else {
        throw new Error(
          response.message || "Une erreur est survenue lors de la mise à jour"
        );
      }
    } catch (error) {
      console.error("Error updating academic UE:", error);
      toast.error("Erreur", {
        description:
          "Impossible de mettre à jour le professeur. Veuillez réessayer.",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!academicUE) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">UE académique non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier UE Académique
          </h1>
          <p className="text-muted-foreground">
            {academicUE.ue.name} - Année {academicUE.year}
          </p>
        </div>
        <Link href="/academics-ue">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ue-name">Nom de l&apos;UE</Label>
                <Input
                  id="ue-name"
                  value={academicUE.ue.name}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Année académique</Label>
                <Input
                  id="year"
                  value={academicUE.year}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periods">Nombre de périodes</Label>
                <Input
                  id="periods"
                  value={academicUE.ue.periods}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début</Label>
                <Input
                  id="start-date"
                  value={new Date(
                    academicUE.start_date || ""
                  ).toLocaleDateString()}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin</Label>
                <Input
                  id="end-date"
                  value={new Date(
                    academicUE.end_date || ""
                  ).toLocaleDateString()}
                  disabled
                  className="bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professor">Professeur</Label>
              <Select
                value={selectedProfessorId}
                onValueChange={setSelectedProfessorId}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un professeur (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">Aucun professeur</SelectItem>
                    {professors.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id.toString()}>
                        {prof.contactDetails.firstName}{" "}
                        {prof.contactDetails.lastName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/academics-ue")}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
