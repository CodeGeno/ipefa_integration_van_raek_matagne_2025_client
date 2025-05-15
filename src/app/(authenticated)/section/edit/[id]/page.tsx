import { SectionEditForm } from "@/components/forms/SectionEditForm";

const SectionEditPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	return (
		<>{id ? <SectionEditForm id={id} /> : <div>Section not found</div>}</>
	);
};

export default SectionEditPage;
