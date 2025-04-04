"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, AccountFormData } from "@/model/schema/account.schema";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { format } from "date-fns";

export const AccountForm: React.FC = () => {
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      contact_details: {
        first_name: "",
        last_name: "",
        birth_date: new Date(),
        gender: GenderEnum.MALE,
        phone_number: "",
      },
      address: {
        street: "123 rue de la paix ",
        number: "123",
        complement: "app 123",
        zip_code: "123456",
        city: "Paris",
        state: "Île-de-France",
        country: "France",
      },
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    try {
      const formattedData = {
        ...data,
        contact_details: {
          ...data.contact_details,
          birth_date: format(data.contact_details.birth_date, "yyyy-MM-dd"),
        },
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/security/create-student/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Erreur lors de la soumission des données: ${response.status} ${errorMessage}`
        );
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Création d'un compte étudiant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Informations personnelles */}
              <PersonalInfoForm control={form.control} />
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
      </Card>
    </div>
  );
};
