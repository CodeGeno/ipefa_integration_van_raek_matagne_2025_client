import { Button, Card } from "@/components/ui";
import EmployeeOverview from "./overview";
import { createUrlWithParams } from "@/utils/url";
import Link from "next/link";

export default async function EmployeePageOverview({
	searchParams,
}: {
	searchParams: Promise<{ search: string; page: number }>;
}) {
	const { search, page } = await searchParams;
	const url = createUrlWithParams("/security/employee/list/", {
		search,
		page,
	});

	return (
		<Card className="p-5 min-h-[600px] min-w-[60%] flex flex-col justify-between">
			<div className="flex flex-col gap-4">
				<div className="flex justify-between align-center text-center">
					<div>
						<h1 className="text-2xl font-bold">
							Liste des employés
						</h1>
					</div>
					<Link href="/employee/create">
						<Button>Ajouter</Button>
					</Link>
				</div>

				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center"></div>
					<EmployeeOverview
						url={url}
						searchValue={search}
					/>
				</div>
			</div>
		</Card>
	);
}
