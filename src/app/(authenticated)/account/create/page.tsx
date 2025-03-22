import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { AccountTypeEnum } from "@/model/type/user.type";

const userFormSchema = z.object({
	accountId: z.number(),
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters"),
	accountType: z.enum(["STUDENT", "PROFESSOR", "EDUCATOR", "ADMIN"] as const),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function UserForm() {
	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			accountId: 0,
			email: "",
			password: "",
			accountType: "STUDENT",
		},
	});

	function onSubmit(values: UserFormValues) {
		// Handle form submission
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="accountId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account ID</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									onChange={(e) =>
										field.onChange(Number(e.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="accountType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account Type</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select account type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.values(AccountTypeEnum).map(
										(type) => (
											<SelectItem
												key={type}
												value={type.toString()}
											>
												{type}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
