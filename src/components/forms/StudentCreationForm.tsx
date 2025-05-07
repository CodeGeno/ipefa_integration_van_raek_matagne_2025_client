"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, AccountFormData } from "@/model/schema/account.schema";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { useForm } from "react-hook-form";
import { post } from "@/app/fetch";
import { Account } from "@/model/entity/users/account.entity";
export const StudentCreationForm: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      contactDetails: {
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        gender: GenderEnum.MALE,
        phoneNumber: "",
      },
      address: {
        street: "123 rue de la paix ",
        number: "123",
        complement: "app 123",
        zipCode: "123456",
        city: "Paris",
        state: "Île-de-France",
        country: "France",
      },
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    try {
      let formattedData = { ...data };
      formattedData.contactDetails.birthDate = format(
        data.contactDetails.birthDate,
        "yyyy-MM-dd"
      ) as unknown as Date;
      console.log(formattedData);

      const response = await post("/security/create-student/", formattedData);

      if (!response.success) {
        toast({
          title: "Erreur lors de la création du compte",
          description: response.message,
        });
        return;
      }
      toast({
        title: "Compte créé avec succès",
        description: "Le compte a été créé avec succès",
      });

      const result = response.data as Account;
      const doc = new jsPDF();

      // Exemple de contenu
      doc.text("Informations du compte", 10, 10);
      doc.text(
        `Nom: ${result.contactDetails.firstName} ${result.contactDetails.lastName}`,
        10,
        20
      );
      doc.text(`Email: ${result.email}`, 10, 30);
      doc.text(`Téléphone: ${result.contactDetails.phoneNumber}`, 10, 40);

      doc.text(
        `Adresse: ${result.address.street}, ${result.address.city}, ${result.address.zipCode}, ${result.address.country}`,
        10,
        50
      );
      doc.text(`Mot de passe: ${result.password}`, 10, 60);
      // Sauvegarde du fichier avec le nom basé sur le prénom et le nom
      const fileName = `${result.contactDetails.firstName}${result.contactDetails.lastName}.pdf`;
      doc.output("dataurlnewwindow");
      router.push("/student/list");
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="container w-full py-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Création d'un compte étudiant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations personnelles */}
            <PersonalInfoForm control={form.control} isEditing={false} />
            {/* Adresse */}
            <AddressForm control={form.control} />
            <div className="flex justify-center">
              <Button type="submit" size="lg">
                Créer le compte
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};
