"use client";

import { useParams } from "next/navigation";

const SectionDetailsPage = ({ params }: { params: { id: string } }) => {
	const { id } = useParams();

	return <div>SectionDetailsPage</div>;
};

export default SectionDetailsPage;
