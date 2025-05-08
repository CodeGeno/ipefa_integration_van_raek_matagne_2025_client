"use client";

import { get } from "@/app/fetch";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { useEffect } from "react";
import { useState } from "react";
import { EmployeeEditForm } from "@/components/forms/EmployeeEditForm";
const EmployeeForm = ({
	id,
	isEditing,
}: {
	id: string;
	isEditing: boolean;
}) => {
	const [employee, setEmployee] = useState<Employee>();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchEmployee = async () => {
			setLoading(true);
			try {
				const response = await get<Employee>(
					`/security/employee/${id}/`
				);
				console.log("dataaa", response.data);
				setEmployee(response.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchEmployee();
	}, [id]);

	return (
		<div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<>
					{employee ? (
						<EmployeeEditForm
							employee={employee}
							isEditing
						/>
					) : (
						<div>Employee not found</div>
					)}
				</>
			)}
		</div>
	);
};

export default EmployeeForm;
