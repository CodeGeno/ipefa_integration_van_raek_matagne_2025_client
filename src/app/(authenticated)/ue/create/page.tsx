"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Section } from "@/model/entity/ue/section.entity";
import { get, post } from "@/app/fetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Save, X, BadgeCheck } from "lucide-react";

// Define schema with Zod
const ueSchema = z.object({
  name: z
    .string()
    .min(3, "Le libellé de l'UE doit contenir au moins 3 caractères")
    .max(255, "Le libellé ne peut pas dépasser 255 caractères"),

  description: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),

  sectionId: z
    .string()
    .min(1, "Veuillez sélectionner une section")
    .refine((val) => !isNaN(parseInt(val)), {
      message: "L'identifiant de section doit être un nombre",
    }),

  isActive: z.boolean().default(true),

  cycle: z
    .number()
    .int("Le cycle doit être un nombre entier")
    .refine((val) => [1, 2, 3, 4].includes(val), {
      message: "Le cycle doit être 1, 2, 3 ou 4",
    }),

  periods: z
    .number()
    .int("Le nombre de périodes doit être un nombre entier")
    .min(1, "Le nombre de périodes doit être positif")
    .max(500, "Le nombre de périodes ne peut pas dépasser 500"),

  prerequisites: z.array(z.number()).default([]),
});

// Infer the TypeScript type from the schema
type UEFormData = z.infer<typeof ueSchema>;

const UECreatePage = () => {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableUEs, setAvailableUEs] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<number[]>(
    []
  );

  // Use zodResolver to connect zod schema to react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UEFormData>({
    resolver: zodResolver(ueSchema),
    defaultValues: {
      name: "",
      description: "",
      sectionId: "",
      isActive: true,
      cycle: 1,
      periods: 0,
    },
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await get<Section[]>("/section/list");
        if (response.success) {
          setSections(response.data || []);
        }
      } catch (error) {
        toast.error("Erreur", {
          description: "Impossible de charger les sections",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleSectionChange = async (sectionId: string) => {
    setValue("sectionId", sectionId);
    try {
      const response = await get<Section>(`/section/${sectionId}/`);
      if (response.success && response.data.ues) {
        // Filtrer uniquement les UEs actives
        const activeUEs = response.data.ues.filter((ue) => ue.isActive);
        setAvailableUEs(
          activeUEs.map((ue) => ({
            id: ue.id,
            name: ue.name,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading UEs:", error);
    }
  };

  const onSubmit = async (data: UEFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Attendre que la requête soit complètement terminée
      const response = await post("/ue/create/", {
        name: data.name,
        description: data.description,
        section: parseInt(data.sectionId),
        isActive: data.isActive,
        cycle: data.cycle,
        periods: data.periods,
        prerequisites: selectedPrerequisites,
      });

      // Vérifier si la requête a réussi
      if (!response.success) {
        throw new Error(response.message || "Une erreur est survenue");
      }

      // Attendre un peu pour s'assurer que tout est bien terminé
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Afficher le toast de succès
      toast.success("UE créée avec succès", {
        description: `L'unité d'enseignement "${data.name}" a été créée avec succès. Vous allez être redirigé...`,
        duration: 3000,
        icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
      });

      // Attendre que le toast soit visible avant de rediriger
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/ue");
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Erreur lors de la création", {
        description:
          "Une erreur est survenue lors de la création de l'UE. Veuillez réessayer.",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Nouvelle unité d'enseignement
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Créez une nouvelle unité d'enseignement pour votre établissement
          </p>
        </div>
        <Link href="/ue">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de l'UE</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <div>
                <Label htmlFor="name">Libellé de l'UE</Label>
                <Input
                  id="name"
                  placeholder="Ex: Projet SGBD"
                  {...register("name")}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Description de l'UE"
                  {...register("description")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="periods">Nombre de périodes</Label>
                  <Input
                    id="periods"
                    type="number"
                    placeholder="Ex: 80"
                    {...register("periods", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.periods && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.periods.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cycle">Cycle</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("cycle", parseInt(value))
                    }
                    defaultValue="1"
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cycle 1</SelectItem>
                      <SelectItem value="2">Cycle 2</SelectItem>
                      <SelectItem value="3">Cycle 3</SelectItem>
                      <SelectItem value="4">Cycle 4</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.cycle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cycle.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="section">Section</Label>
                <Select
                  onValueChange={handleSectionChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.length > 0 ? (
                      sections.map((section) => (
                        <SelectItem
                          key={section.id.toString()}
                          value={section.id.toString()}
                        >
                          {section.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Aucune section disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.sectionId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sectionId.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="prerequisites">Prérequis</Label>
                <div className="relative">
                  <Select
                    onValueChange={(value) => {
                      const id = parseInt(value);
                      if (!selectedPrerequisites.includes(id)) {
                        setSelectedPrerequisites([
                          ...selectedPrerequisites,
                          id,
                        ]);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner des prérequis" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUEs.length > 0 ? (
                        availableUEs
                          .filter(
                            (ue) => !selectedPrerequisites.includes(ue.id)
                          )
                          .map((ue) => (
                            <SelectItem
                              key={ue.id.toString()}
                              value={ue.id.toString()}
                            >
                              {ue.name}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {selectedPrerequisites.length > 0
                            ? "Toutes les UEs sont déjà sélectionnées"
                            : "Sélectionnez d'abord une section"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {selectedPrerequisites.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedPrerequisites.map((id) => {
                        const ue = availableUEs.find((u) => u.id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                          >
                            {ue?.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => {
                                setSelectedPrerequisites(
                                  selectedPrerequisites.filter((p) => p !== id)
                                );
                              }}
                              disabled={isSubmitting}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Créer l'UE</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UECreatePage;
