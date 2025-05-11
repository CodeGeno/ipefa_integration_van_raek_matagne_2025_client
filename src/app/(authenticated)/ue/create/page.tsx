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
import { ArrowLeft, BookOpen, Save } from "lucide-react";

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
});

// Infer the TypeScript type from the schema
type UEFormData = z.infer<typeof ueSchema>;

const UECreatePage = () => {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const onSubmit = async (data: UEFormData) => {
    try {
      const response = await post("/ue/create/", {
        name: data.name,
        description: data.description,
        section: parseInt(data.sectionId),
        isActive: data.isActive,
        cycle: data.cycle,
        periods: data.periods,
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

  const handleSectionChange = (value: string) => {
    setValue("sectionId", value);
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
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UECreatePage;
