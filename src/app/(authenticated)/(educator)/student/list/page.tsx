import StudentOverview from "./overview";
import { createUrlWithParams } from "@/utils/url";

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
		<div className="flex flex-col gap-4">
			<h1>Vue d'ensemble des étudiants</h1>
			<div className="flex flex-col gap-4">
				<h2>Liste des étudiants</h2>
				<StudentOverview
					url={url}
					searchValue={search}
				/>
			</div>
		</div>
	);
}
