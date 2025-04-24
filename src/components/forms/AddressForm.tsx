import React from "react";
import { Control } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AddressFormProps {
	control: Control<any>;
}

export const AddressForm: React.FC<AddressFormProps> = ({ control }) => {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Adresse</h3>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="address.street"
					render={({ field }) => (
						<FormItem className="md:col-span-2">
							<FormLabel>Rue</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="address.number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Numéro</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="address.complement"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Complément</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="address.zipCode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Code postal</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="address.city"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ville</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="address.state"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Province</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="address.country"
					render={({ field }) => (
						<FormItem className="md:col-span-2">
							<FormLabel>Pays</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};
