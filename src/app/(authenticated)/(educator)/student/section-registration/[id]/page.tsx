"use client";

import { useParams } from "next/navigation";

const StudentSectionRegistrationPage = ({
	params,
}: {
	params: { id: string };
}) => {
	const { id } = useParams();

	return <div>StudentSectionRegistrationPage{id}</div>;
};

export default StudentSectionRegistrationPage;
