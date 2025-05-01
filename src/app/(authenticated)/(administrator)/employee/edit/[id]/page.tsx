import { get } from "@/app/fetch";
import EmployeeForm from "../employee-form";

const EmployeeEditPage = async ({ params }: { params: { id: string } }) => {
	return (
		<EmployeeForm
			id={params.id}
			isEditing
		/>
	);
};

export default EmployeeEditPage;
