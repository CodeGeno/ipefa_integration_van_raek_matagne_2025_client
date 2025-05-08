import StudentOverview from "./overview";
import { createUrlWithParams } from "@/utils/url";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StudentPageOverview({
	searchParams,
}: {
	searchParams: Promise<{ search: string; page: number }>;
}) {
	const { search, page } = await searchParams;
	const url = createUrlWithParams("/security/student/list/", {
		search,
		page,
	});

	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex justify-between align-center text-center">
				<h1 className="text-2xl font-bold">Liste des élèves</h1>
				<Link href="/student/create">
					<Button>Ajouter</Button>
				</Link>
			</div>
			<div className="flex flex-col gap-4">
				<StudentOverview
					url={url}
					searchValue={search}
				/>
			</div>
		</div>
	);
}
