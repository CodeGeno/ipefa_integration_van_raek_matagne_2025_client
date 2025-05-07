"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, AccountFormData } from "@/model/schema/account.schema";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { get, post } from "@/app/fetch";
import { Student } from "@/model/entity/users/student.entity";

export const StudentEditForm: React.FC<{ id: string }> = ({ id }) => {
	const { toast } = useToast();
	const router = useRouter();
	const [student, setStudent] = useState<Student>();
	useEffect(() => {
		fetchStudent();
	}, [id]);
	const fetchStudent = async () => {
		const response = await get<Student>(`/security/student/${id}`);
		if (response.data) {
			const birthDate = new Date(response.data.contactDetails.birthDate);
			response.data.contactDetails.birthDate = birthDate;
		}
		setStudent(response.data);
		console.log(response.data);
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

	useEffect(() => {
		if (student) {
			form.reset({
				...student,
			});
		}
	}, [student, form]);

	const onSubmit = async (data: AccountFormData) => {
		console.log(data);
		try {
			let formattedData = { ...data, id: id };
			formattedData.contactDetails.birthDate = format(
				data.contactDetails.birthDate,
				"yyyy-MM-dd"
			) as unknown as Date;
			console.log(formattedData);

			const response = await post(
				`/security/student/edit/${id}`,
				formattedData
			);

			if (response.success !== true) {
				toast({
					title: "Erreur lors de la modification du compte",
					description: response.message,
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
		}
	};

	return (
		<div className="container w-full py-8">
			<CardHeader>
				<CardTitle className="text-center text-2xl">
					Modification d'un compte étudiant
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Informations personnelles */}
						<PersonalInfoForm
							control={form.control}
							isEditing
						/>
						{/* Adresse */}
						<AddressForm control={form.control} />
						<div className="flex justify-center">
							<Button
								type="submit"
								size="lg"
							>
								Modifier le compte
							</Button>
							<Button
								type="button"
								onClick={() => {
									console.log(form.formState.errors);
								}}
							>
								Vérifier erreurs
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</div>
	);
};
