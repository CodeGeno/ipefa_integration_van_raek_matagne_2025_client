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

export const AccountForm: React.FC = () => {
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: "zoubir@gmail.com",
      password: "",
      personalCode: "",
      role: AccountRoleEnum.STUDENT,
      contactDetails: {
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        gender: GenderEnum.MALE,
        phoneNumber: "",
      },
      address: {
        street: "123 rue de la paix ",
        streetNumber: "123",
        complement: "app 123",
        zipCode: "123456",
        city: "Paris",
        state: "Île-de-France",
        country: "France",
      },
    },
  });

  const onSubmit = (data: AccountFormData) => {
    console.log(data);
    // TODO: Implémenter la logique de soumission
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
