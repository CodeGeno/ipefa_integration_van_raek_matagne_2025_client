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
	const { setTheme } = useTheme();

	const selectedTheme = localStorage.getItem("theme") ?? "light";
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="w-full">
				<div className="flex justify-end pt-5 pr-5">
					<Button
						onClick={() =>
							setTheme(
								selectedTheme === "light" ? "dark" : "light"
							)
						}
					>
						{selectedTheme === "light" ? (
							<MdOutlineDarkMode />
						) : (
							<MdOutlineLightMode />
						)}
					</Button>
				</div>

				<div className="mx-10 pt-5 sm: pt-O mx-3">
					<Card className="p-5 sm: p-0">{children}</Card>
				</div>
				<Toaster />
			</main>
		</SidebarProvider>
	);
};

export default AuthenticatedLayout;
