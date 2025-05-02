"use client";
import { useParams } from "next/navigation";

const SectionCreatePage = () => {
	const { id } = useParams();
	return <div>{id}</div>;
};

export default SectionCreatePage;
