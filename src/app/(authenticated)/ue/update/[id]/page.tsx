// src/app/(authenticated)/ue/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Section } from "@/model/entity/ue/section.entity";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, BookOpen, GraduationCap, Clock } from "lucide-react";
import Link from "next/link";
import { get, patch } from "@/app/fetch";
import { toast } from "@/hooks/use-toast";

// Define schema with Zod
const ueUpdateSchema = z.object({
  name: z.string().min(1, "Le libellé de l'UE est requis"),
  description: z.string().optional(),
  sectionId: z.string().min(1, "Veuillez sélectionner une section"),
  isActive: z.boolean(),
  cycle: z
    .number()
    .int("Le cycle doit être un nombre entier")
    .min(1, "Le cycle doit être positif"),
  periods: z
    .number()
    .int("Le nombre de périodes doit être un nombre entier")
    .min(1, "Le nombre de périodes doit être positif"),
});

type UEFormData = z.infer<typeof ueUpdateSchema>;

const UEEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const ueId = params.id;

  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UEFormData>({
    resolver: zodResolver(ueUpdateSchema),
    defaultValues: {
      name: "",
      description: "",
      sectionId: "",
      isActive: true,
      cycle: 1,
      periods: 0,
    },
    mode: "onBlur",
  });

  // Fetch UE data and sections
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [ueResponse, sectionsResponse] = await Promise.all([
          get<ParsedUE>(`/ue/${ueId}/`),
          get<Section[]>("/section/list/"),
        ]);

        if (ueResponse.success && sectionsResponse.success) {
          setSections(sectionsResponse.data || []);
          const ue = ueResponse.data;
          if (ue) {
            reset({
              name: ue.name,
              description: ue.description || "",
              sectionId: ue.section.toString(),
              isActive: ue.isActive,
              cycle: ue.cycle,
              periods: ue.periods,
            });
          }
        } else {
          throw new Error("Erreur lors de la récupération des données");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (ueId) {
      fetchData();
    }
  }, [ueId, reset]);

  const onSubmit = async (data: UEFormData) => {
    try {
      const response = await patch(`/ue/update/${ueId}/`, {
        name: data.name,
        description: data.description,
        section: parseInt(data.sectionId),
        isActive: data.isActive,
        cycle: data.cycle,
        periods: data.periods,
      });

      if (response.success) {
        toast({
          title: "Succès",
          description: "L'UE a été mise à jour avec succès",
        });
        router.push("/ue");
      } else {
        throw new Error(
          response.message || "Erreur lors de la mise à jour de l'UE"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la mise à jour"
      );
      console.error("Error updating UE:", err);
    }
  };

  const handleSectionChange = (value: string) => {
    setValue("sectionId", value);
    trigger("sectionId");
  };

  const handleFieldBlur = (fieldName: keyof UEFormData) => {
    return () => {
      trigger(fieldName);
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Modification de l'UE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-40">
              <p>Chargement des données...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => router.push("/ue")}>
                Retour à la liste des UEs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Modifier l'UE</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modifiez les informations de l'unité d'enseignement
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
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Informations de l'UE</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Libellé */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Libellé de l'UE
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Projet SGBD"
                  {...register("name")}
                  onBlur={handleFieldBlur("name")}
                  className="h-10"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Description de l'UE"
                  {...register("description")}
                  onBlur={handleFieldBlur("description")}
                  className="h-10"
                />
              </div>

              {/* Nombre de périodes */}
              <div className="space-y-2">
                <Label
                  htmlFor="periods"
                  className="text-base flex items-center gap-2"
                >
                  <Clock className="h-4 w-4 text-primary" />
                  Nombre de périodes
                </Label>
                <Input
                  id="periods"
                  type="number"
                  placeholder="Ex: 80"
                  {...register("periods", { valueAsNumber: true })}
                  onBlur={handleFieldBlur("periods")}
                  className="h-10"
                />
                {errors.periods && (
                  <p className="text-sm text-red-500">
                    {errors.periods.message}
                  </p>
                )}
              </div>

              {/* Cycle */}
              <div className="space-y-2">
                <Label
                  htmlFor="cycle"
                  className="text-base flex items-center gap-2"
                >
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Cycle
                </Label>
                <Input
                  id="cycle"
                  type="number"
                  placeholder="Ex: 1"
                  {...register("cycle", { valueAsNumber: true })}
                  onBlur={handleFieldBlur("cycle")}
                  className="h-10"
                />
                {errors.cycle && (
                  <p className="text-sm text-red-500">{errors.cycle.message}</p>
                )}
              </div>

              {/* Section */}
              <div className="space-y-2">
                <Label htmlFor="section" className="text-base">
                  Section
                </Label>
                <Select
                  onValueChange={handleSectionChange}
                  defaultValue={watch("sectionId")}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Sélectionner une section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.length > 0 ? (
                      sections.map((section) => (
                        <SelectItem
                          key={section.id}
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
                  <p className="text-sm text-red-500">
                    {errors.sectionId.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-base">Statut</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={watch("isActive")}
                    onCheckedChange={(checked) => {
                      setValue("isActive", checked === true);
                    }}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    UE active
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/ue")}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UEEditPage;
