import EmployeeOverview from "./overview";
import { createUrlWithParams } from "@/utils/url";

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
		<div className="flex flex-col gap-4">
			<h1>Vue d'ensemble des employés</h1>
			<div className="flex flex-col gap-4">
				<h2>Liste des employés</h2>
				<EmployeeOverview
					url={url}
					searchValue={search}
				/>
			</div>
		</div>
	);
}
