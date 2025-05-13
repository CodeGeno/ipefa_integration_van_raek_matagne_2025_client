"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";
import { patch } from "@/app/fetch";
import { sectionSchema, SectionFormData } from "@/model/schema/section.schema";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "@/model/entity/ue/section.entity";
import { useState, useEffect } from "react";
import { get } from "@/app/fetch";
import Link from "next/link";
import { ArrowLeft, Save, BadgeCheck } from "lucide-react";

export const SectionEditForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const [section, setSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialisation du formulaire avec React Hook Form
  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    // On initialise avec des valeurs vides
    defaultValues: {
      name: "",
      sectionType: undefined,
      sectionCategory: undefined,
      description: "",
    },
  });

  useEffect(() => {
    fetchSection();
  }, [id]);

  const fetchSection = async () => {
    try {
      setIsLoading(true);
      const response = await get<Section>(`/section/${id}`);
      const sectionData = response.data;

      if (sectionData) {
        setSection(sectionData);

        // Conversion des enums en chaînes pour le formulaire
        const sectionTypeKey = Object.keys(SectionTypeEnum).find(
          (key) =>
            SectionTypeEnum[key as keyof typeof SectionTypeEnum] ===
            sectionData.sectionType
        );

        const sectionCategoryKey = Object.keys(SectionCategoryEnum).find(
          (key) =>
            SectionCategoryEnum[key as keyof typeof SectionCategoryEnum] ===
            sectionData.sectionCategory
        );

        // Mise à jour des valeurs du formulaire après chargement des données
        form.reset({
          name: sectionData.name || "",
          sectionType: sectionTypeKey,
          sectionCategory: sectionCategoryKey,
          description: sectionData.description || "",
        });
      } else {
        toast.error("Erreur", {
          description: "Données de section invalides",
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger les données de la section",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: SectionFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await patch(`/section/update/${id}/`, values);

      if (!response.success) {
        throw new Error(response.message || "Une erreur est survenue");
      }

      // Attendre un peu pour s'assurer que tout est bien terminé
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Afficher le toast de succès
      toast.success("Section modifiée avec succès", {
        description: `La section "${values.name}" a été modifiée avec succès. Vous allez être redirigé...`,
        duration: 3000,
        icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
      });

      // Attendre que le toast soit visible avant de rediriger
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/section/list");
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Erreur lors de la modification", {
        description:
          "Une erreur est survenue lors de la modification de la section. Veuillez réessayer.",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Modification de la section</CardTitle>
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Modification de la section</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modifiez les informations de la section
          </p>
        </div>
        <Link href="/section/list">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de la section</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la section</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Bachelier en Informatique"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sectionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de cursus</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner durée de cursus" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(SectionTypeEnum).map((key) => (
                              <SelectItem key={key} value={key}>
                                {
                                  SectionTypeEnum[
                                    key as keyof typeof SectionTypeEnum
                                  ]
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sectionCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(SectionCategoryEnum).map((key) => (
                              <SelectItem key={key} value={key}>
                                {
                                  SectionCategoryEnum[
                                    key as keyof typeof SectionCategoryEnum
                                  ]
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Cette section est destinée aux étudiants qui souhaitent devenir informaticiens"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      <span>Modification en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Enregistrer les modifications</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
