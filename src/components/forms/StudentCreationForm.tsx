"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, AccountFormData } from "@/model/schema/account.schema";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { useForm } from "react-hook-form";
import { post } from "@/app/fetch";
import { Account } from "@/model/entity/users/account.entity";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Save, X } from "lucide-react";

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
        street: "",
        number: "",
        complement: "",
        zipCode: "",
        city: "",
        state: "",
        country: "Belgique",
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

      const response = await post("/security/create-student/", formattedData);

      if (!response.success) {
        toast({
          title: "Erreur lors de la création du compte",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Compte créé avec succès",
        description: "Le compte a été créé avec succès",
      });

      const result = response.data as Account;
      const doc = new jsPDF();

      // Génération du PDF avec les informations du compte
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

      // Affichage du PDF
      doc.output("dataurlnewwindow");

      // Redirection vers la liste des étudiants
      router.push("/student/list");
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du compte",
        variant: "destructive",
      });
    }
  };

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
                      Renseignez les informations personnelles de l'étudiant
                    </p>
                  </div>
                </div>
                <PersonalInfoForm control={form.control} isEditing={false} />
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
                      Renseignez l'adresse de l'étudiant
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
            Créer l'étudiant
          </Button>
        </div>
      </form>
    </Form>
  );
};
