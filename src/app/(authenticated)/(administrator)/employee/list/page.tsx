import EmployeeOverview from "./overview";

export default async function EmployeePageOverview({
	searchParams,
}: {
	searchParams: Promise<{ search: string; page: number }>;
}) {
	const { search, page } = await searchParams;
	let url = "/security/employee/list/";
	if (search || page) url += "?";
	if (search) url += "search=" + search + "&";
	if (page) url += "page=" + page;

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
