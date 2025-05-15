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
import { post } from "@/app/fetch";
import { sectionSchema, SectionFormData } from "@/model/schema/section.schema";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const SectionCreatePage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      sectionType: undefined,
      sectionCategory: undefined,
      description: "",
    },
  });

  const onSubmit = async (values: SectionFormData) => {
    if (isSubmitting) return; // Empêche les soumissions multiples

    try {
      setIsSubmitting(true);
      const response = await post("/section/create/", values);

      if (response.success) {
        // Attendre un peu avant la redirection pour que l'utilisateur voie le message
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        toast.success("Section créée avec succès", {
          description: `La section "${values.name}" a été créée avec succès. Vous allez être redirigé...`,
          duration: 3000,
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });
        router.push("/section/list");
      } else {
        throw new Error(response.message || "Une erreur est survenue");
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Erreur lors de la création", {
        description:
          "Une erreur est survenue lors de la création de la section. Veuillez réessayer.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Nouvelle section</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Créez une nouvelle section pour organiser les unités d'enseignement
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
                          value={field.value}
                          onChange={field.onChange}
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
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Enregistrer</span>
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

export default SectionCreatePage;
