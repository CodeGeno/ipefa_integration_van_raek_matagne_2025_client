"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";

interface DatePickerProps {
	startYear?: number;
	endYear?: number;
	selected: Date | undefined;
	onSelect: (date: Date | undefined) => void;
	disabled?: (date: Date) => boolean;
}

export function DatePicker({
	startYear = getYear(new Date()) - 100,
	endYear = getYear(new Date()) + 100,
	selected,
	onSelect,
	disabled,
}: DatePickerProps) {
	const [date, setDate] = React.useState<Date | undefined>(selected);

	React.useEffect(() => {
		setDate(selected);
	}, [selected]);

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const years = Array.from(
		{ length: endYear - startYear + 1 },
		(_, i) => startYear + i
	);

	const handleMonthChange = (month: string) => {
		const newDate = setMonth(date || new Date(), months.indexOf(month));
		setDate(newDate);
		onSelect(newDate);
	};

	const handleYearChange = (year: string) => {
		const newDate = setYear(date || new Date(), parseInt(year));
		setDate(newDate);
		onSelect(newDate);
	};

	const handleSelect = (selectedData: Date | undefined) => {
		if (selectedData && (!disabled || !disabled(selectedData))) {
			setDate(selectedData);
			onSelect(selectedData);
		}
	};

	return (
		<>
			<div className="flex justify-between p-2">
				<Select
					onValueChange={handleMonthChange}
					value={months[getMonth(date || new Date())]}
				>
					<SelectTrigger className="w-[110px]">
						<SelectValue placeholder="Month" />
					</SelectTrigger>
					<SelectContent>
						{months.map((month) => (
							<SelectItem
								key={month}
								value={month}
							>
								{month}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					onValueChange={handleYearChange}
					value={getYear(date || new Date()).toString()}
				>
					<SelectTrigger className="w-[110px]">
						<SelectValue placeholder="Year" />
					</SelectTrigger>
					<SelectContent>
						{years.map((year) => (
							<SelectItem
								key={year}
								value={year.toString()}
							>
								{year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Calendar
				mode="single"
				selected={date}
				onSelect={handleSelect}
				initialFocus
				month={date || new Date()}
				onMonthChange={setDate}
				disabled={disabled}
			/>
		</>
	);
}

export default DatePicker;
