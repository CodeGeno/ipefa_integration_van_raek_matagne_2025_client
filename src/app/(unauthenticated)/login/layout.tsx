"use client";
import { ReactNode, useEffect } from "react";
import UnauthenticatedLayout from "@/components/layout/unathenticated-layout";
import { AccountContext } from "@/app/context";
import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

const SecurityLayout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<UnauthenticatedLayout>{children}</UnauthenticatedLayout>
		</>
	);
};
export default SecurityLayout;
