import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { createUrlWithParams } from "@/utils/url";
import SectionOverview from "./overview";
import Link from "next/link";
import { Plus } from "lucide-react";

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
		<div className="container mx-auto p-4 space-y-6">
			<div className="flex justify-between items-center">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						Sections
					</h1>
					<p className="text-muted-foreground">
						Gérez les sections et leurs unités d'enseignement
					</p>
				</div>
				<Link href="/section/create">
					<Button className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Ajouter une section
					</Button>
				</Link>
			</div>

			<CardContent className="p-6 bg-white rounded-lg shadow-sm">
				<SectionOverview
					url={url}
					searchValue={search}
					categoryValue={category}
					typeValue={type}
				/>
			</CardContent>
		</div>
	);
};

export default SectionPage;
