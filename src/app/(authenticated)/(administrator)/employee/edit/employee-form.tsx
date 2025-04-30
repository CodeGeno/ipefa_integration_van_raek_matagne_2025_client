"use client";

import { get } from "@/app/fetch";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { useEffect } from "react";
import { useState } from "react";

const EmployeeForm = ({ id }: { id: string }) => {
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchEmployee = async () => {
			setLoading(true);
			try {
				const response = await get(`/security/employee/${id}`);
				console.log(response);
			} catch (error) {
				setError(error as string);
			} finally {
				setLoading(false);
			}
		};
		fetchEmployee();
	}, [id]);

	return <div>EmployeeForm</div>;
};

export default EmployeeForm;
