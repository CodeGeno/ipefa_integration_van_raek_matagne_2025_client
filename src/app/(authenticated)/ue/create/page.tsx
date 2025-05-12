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
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, BookOpen, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

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
    .min(1, "Le cycle doit être au minimum 1")
    .max(3, "Le cycle ne peut pas dépasser 3"),

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
        toast({
          title: "Erreur",
          description: "Impossible de charger les sections",
          variant: "destructive",
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
    try {
      const response = await post("/ue/create/", {
        name: data.name,
        description: data.description,
        section: parseInt(data.sectionId),
        isActive: data.isActive,
        cycle: data.cycle,
        periods: data.periods,
        prerequisites: selectedPrerequisites,
      });

      if (response.success) {
        toast({
          title: "UE créée",
          description: "L'unité d'enseignement a été créée avec succès",
        });
        setTimeout(() => {
          router.push("/ue");
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'UE",
        variant: "destructive",
      });
    }
  };

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
                  />
                  {errors.periods && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.periods.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cycle">Cycle</Label>
                  <Input
                    id="cycle"
                    type="number"
                    placeholder="Ex: 1"
                    {...register("cycle", { valueAsNumber: true })}
                  />
                  {errors.cycle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cycle.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="section">Section</Label>
                <Select onValueChange={handleSectionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une section" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Chargement des sections...
                      </SelectItem>
                    ) : sections.length > 0 ? (
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
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Créer l'UE
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UECreatePage;
