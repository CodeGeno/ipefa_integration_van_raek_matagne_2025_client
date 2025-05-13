"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, AccountFormData } from "@/model/schema/account.schema";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { get, patch } from "@/app/fetch";
import { Student } from "@/model/entity/users/student.entity";
import { User, MapPin, Save, X, BadgeCheck } from "lucide-react";

export const StudentEditForm: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const [student, setStudent] = useState<Student>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await get<Student>(`/security/student/${id}/`);
      if (response.success && response.data) {
        const birthDate = new Date(response.data.contactDetails.birthDate);
        response.data.contactDetails.birthDate = birthDate;
        setStudent(response.data);
      } else {
        toast.error("Erreur", {
          description: "Impossible de récupérer les informations de l'étudiant",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur", {
        description:
          "Une erreur est survenue lors de la récupération des données",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      contactDetails: {
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        gender: GenderEnum.MALE,
        phoneNumber: "",
        identifier: "",
      },
      address: {
        street: "",
        number: "",
        complement: "",
        zipCode: "",
        city: "",
        state: "",
        country: "Belgique",
      },
      email: "",
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        ...student,
      });
    }
  }, [student, form]);

  const onSubmit = async (data: AccountFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formattedData = {
        ...data,
        id: id,
        contactDetails: {
          ...data.contactDetails,
          birthDate: format(data.contactDetails.birthDate, "yyyy-MM-dd"),
        },
      };

      const response = await patch(
        `/security/student/edit/${id}/`,
        formattedData
      );

      if (response.success) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        toast.success("Étudiant modifié avec succès", {
          description: `Les modifications de l'étudiant ${data.contactDetails.firstName} ${data.contactDetails.lastName} ont été enregistrées. Vous allez être redirigé...`,
          duration: 3000,
          icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
        });

        router.push("/student/list");
      } else {
        throw new Error(response.message || "Une erreur est survenue");
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Erreur lors de la modification", {
        description:
          "Une erreur est survenue lors de la modification de l'étudiant. Veuillez réessayer.",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Informations personnelles
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Modifiez les informations personnelles de l'étudiant
                    </p>
                  </div>
                </div>
                <PersonalInfoForm
                  control={form.control}
                  isEditing={true}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Adresse</h3>
                    <p className="text-sm text-muted-foreground">
                      Modifiez l'adresse de l'étudiant
                    </p>
                  </div>
                </div>
                <AddressForm control={form.control} disabled={isSubmitting} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/student/list")}
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
            Annuler
          </Button>
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
                <span>Enregistrer les modifications</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
