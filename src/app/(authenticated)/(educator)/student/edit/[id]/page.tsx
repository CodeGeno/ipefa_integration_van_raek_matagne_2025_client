import { StudentEditForm } from "@/components/forms/StudentEditForm";

const StudentEditPage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params;
	return <StudentEditForm id={id} />;
};

export default StudentEditPage;
