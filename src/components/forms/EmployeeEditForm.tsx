"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { format } from "date-fns";
import {
  employeeSchema,
  EmployeeFormData,
} from "@/model/schema/employee.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patch } from "@/app/fetch";
import { toast } from "@/hooks/use-toast";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2, Shield } from "lucide-react";

export const EmployeeEditForm: React.FC<{
  employee: Employee;
  isEditing: boolean;
}> = ({ employee, isEditing }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      ...employee,
      contactDetails: {
        ...employee.contactDetails,
        birthDate: new Date(employee.contactDetails.birthDate),
      },
    },
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
    }
  }, [form]);

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);

    try {
      let formattedData = {
        ...data,
        contactDetails: {
          ...data.contactDetails,
          birthDate: format(data.contactDetails.birthDate, "yyyy-MM-dd"),
        },
      };

      const response = await patch(
        `/security/employee/edit/${employee.id}/`,
        formattedData
      );

      const result = await response;

      toast({
        title: "Succès",
        description: "Le compte employé a été modifié avec succès",
      });
      setTimeout(() => {
        router.push("/employee/list");
      }, 1500);
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la modification du compte",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rôle de l&apos;employé
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Select
              onValueChange={(value) =>
                form.setValue("role", value as AccountRoleEnum)
              }
              defaultValue={employee.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(AccountRoleEnum)
                  .filter((r) => r !== "STUDENT")
                  .map((role) => {
                    const roleKey = role as keyof typeof AccountRoleEnum;
                    return (
                      <SelectItem key={role} value={role}>
                        {AccountRoleEnum[roleKey]}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <PersonalInfoForm control={form.control} isEditing />
        <AddressForm control={form.control} />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/employee/list")}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
            className="min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : form.formState.isValid ? (
              <>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Mettre à jour
              </>
            ) : (
              "Veuillez corriger les erreurs"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
