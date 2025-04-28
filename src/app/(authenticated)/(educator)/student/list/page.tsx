import StudentOverview from "./overview";

export default async function StudentPageOverview({
	searchParams,
}: {
	searchParams: Promise<{ search: string; page: number }>;
}) {
	const { search, page } = await searchParams;
	let url = "/security/student/list/";
	if (search || page) url += "?";
	if (search) url += "search=" + search + "&";
	if (page) url += "page=" + page;

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
