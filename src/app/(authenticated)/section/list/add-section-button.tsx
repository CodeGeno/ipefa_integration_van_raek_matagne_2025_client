"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { AccountContext } from "@/app/context";
const AddSectionButton = () => {
	const { accountData } = useContext(AccountContext);
	return (
		<>
			{accountData?.role === "ADMINISTRATOR" && (
				<Link href="/section/create">
					<Button className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Ajouter une section
					</Button>
				</Link>
			)}
		</>
	);
};
export default AddSectionButton;
