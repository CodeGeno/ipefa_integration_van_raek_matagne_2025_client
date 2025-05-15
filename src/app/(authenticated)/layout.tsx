"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MdOutlineLightMode } from "react-icons/md";
import { Toaster } from "@/components/ui/sonner";
import { MdOutlineDarkMode } from "react-icons/md";
import { useTheme } from "next-themes";
import { AccountContext } from "@/app/context";
import { useContext } from "react";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="w-full mt-10">
				<div className="mx-10 pt-10 sm: pt-5 mx-3">
					<Card className="p-5 sm: p-0">{children}</Card>
				</div>
				<Toaster />
			</main>
		</SidebarProvider>
	);
};

export default AuthenticatedLayout;
