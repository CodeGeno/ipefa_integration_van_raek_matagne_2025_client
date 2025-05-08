import EmployeeForm from "../employee-form";

const EmployeeEditPage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params;
	return (
		<EmployeeForm
			id={id}
			isEditing
		/>
	);
};

export default EmployeeEditPage;
