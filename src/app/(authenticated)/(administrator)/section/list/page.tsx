import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createUrlWithParams } from "@/utils/url";
import SectionOverview from "./overview";
import Link from "next/link";

const SectionPage = async ({
	searchParams,
}: {
	searchParams: Promise<{
		search: string;
		page: number;
		category: string;
		type: string;
	}>;
}) => {
	const { search, page, category, type } = await searchParams;
	const url = createUrlWithParams("/section/list", {
		search,
		page,
		category,
		type,
	});
	return (
		<>
			<CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
				<CardTitle className="text-xl md:text-2xl">
					Liste des Sections
				</CardTitle>
				<div className="w-full md:w-auto flex justify-end ">
					<Link
						className="w-full"
						href="/section/create"
					>
						<Button className="w-full">Ajouter une section</Button>
					</Link>
				</div>
			</CardHeader>

			<CardContent>
				<SectionOverview
					url={url}
					searchValue={search}
					categoryValue={category}
					typeValue={type}
				/>
			</CardContent>
		</>
	);
};

export default SectionPage;
