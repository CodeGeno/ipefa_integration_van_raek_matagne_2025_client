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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { get, patch } from "@/app/fetch";
import { Student } from "@/model/entity/users/student.entity";
import { User, MapPin, Save, X } from "lucide-react";

export const StudentEditForm: React.FC<{ id: string }> = ({ id }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [student, setStudent] = useState<Student>();
  const [isLoading, setIsLoading] = useState(true);

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
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations de l'étudiant",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la récupération des données",
        variant: "destructive",
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
    try {
      let formattedData = { ...data, id: id };
      formattedData.contactDetails.birthDate = format(
        data.contactDetails.birthDate,
        "yyyy-MM-dd"
      ) as unknown as Date;

      const response = await patch(
        `/security/student/edit/${id}/`,
        formattedData
      );

      if (!response.success) {
        toast({
          title: "Erreur lors de la modification du compte",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Compte modifié avec succès",
        description: "Le compte a été modifié avec succès",
      });

      setTimeout(() => {
        router.push("/student/list");
      }, 1500);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la modification du compte",
        variant: "destructive",
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
                <PersonalInfoForm control={form.control} isEditing={true} />
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
                <AddressForm control={form.control} />
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
          >
            <X className="h-4 w-4" />
            Annuler
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Form>
  );
};
