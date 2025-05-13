"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { post } from "@/app/fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2, Shield } from "lucide-react";

export const EmployeeCreationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      role: undefined,
      contactDetails: {
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        gender: undefined,
        phoneNumber: "",
      },
      address: {
        street: "",
        number: "",
        complement: "",
        zipCode: "",
        city: "",
        state: "",
        country: "",
      },
    },
  });

  useEffect(() => {
    if (process.env.NODE_ENV === "development")
      if (Object.keys(form.formState.errors).length > 0) {
        console.log("Erreurs de validation:", form.formState.errors);
      }
  }, [form.formState.errors]);

  const onSubmit = async (data: EmployeeFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formattedData = {
        ...data,
        contactDetails: {
          ...data.contactDetails,
          birthDate: format(data.contactDetails.birthDate, "yyyy-MM-dd"),
        },
      };

      const response = await post("/security/create-employee/", formattedData);

      if (response.success) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        toast.success("Employé créé avec succès", {
          description: `L'employé ${data.contactDetails.firstName} ${data.contactDetails.lastName} a été créé avec succès. Vous allez être redirigé...`,
          duration: 3000,
          icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
        });
        router.push("/employee/list");
      } else {
        throw new Error(response.message || "Une erreur est survenue");
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Erreur lors de la création", {
        description:
          "Une erreur est survenue lors de la création de l'employé. Veuillez réessayer.",
        duration: 5000,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Création d'un employé</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(AccountRoleEnum)
                          .filter((role) => role !== "STUDENT")
                          .map((role) => (
                            <SelectItem key={role} value={role}>
                              {
                                AccountRoleEnum[
                                  role as keyof typeof AccountRoleEnum
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

              <PersonalInfoForm
                control={form.control}
                isEditing={false}
                disabled={isSubmitting}
              />
              <AddressForm control={form.control} disabled={isSubmitting} />
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
                    <Shield className="h-4 w-4" />
                    <span>Enregistrer</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
