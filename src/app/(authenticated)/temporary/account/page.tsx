"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
enum Genre {
	MALE = "Homme",
	FEMALE = "Femme",
}
const AccountPage = () => {
	const [date, setDate] = React.useState<Date>();
	return (
		<>
			<h1>Création de compte</h1>
			<div className="m-2 flex flex-col gap-2">
				<Label>Nom</Label>
				<Input type="text" />
			</div>
			<div className="m-2 flex flex-col gap-2">
				<Label>Prénom</Label>
				<Input type="text" />
			</div>
			<div className="m-2 flex flex-col gap-2">
				<Label>Genre</Label>
				<Select>
					<SelectTrigger className="">
						<SelectValue placeholder="Genre" />
					</SelectTrigger>
					<SelectContent>
						{Object.values(Genre).map((genre) => (
							<SelectItem
								key={genre}
								value={genre.toLowerCase()}
							>
								{genre}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="m-2 flex flex-col gap-2">
				<Label>Date de naissance</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"justify-start text-left font-normal",
								!date && "text-muted-foreground"
							)}
						>
							<CalendarIcon />
							{date ? (
								format(date, "PPP")
							) : (
								<span>Choisir une date</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto p-0"
						align="start"
					>
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
		</>
	);
};
export default AccountPage;
