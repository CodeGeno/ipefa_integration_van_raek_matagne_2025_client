import * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import heplLogo from "./../../public/images/HEPL_new_2.png";
import { title } from "process";
console.log(localStorage.getItem("role"));
// Nouvel objet de données

const studentRoutes = [
	{
		title: "UE",
		url: "/ue", // Remplacez par le chemin réel
	},
];
const commonRoutes = {
	title: "Profil",
	url: "#/profil",
	items: [{ title: "Mon compte", url: "/" }],
};
const data = {
	navMain: [
		commonRoutes,
		{
			title: "Modules",
			url: "#",
			items: [
				{
					title: "UE",
					url: "/ue", // Remplacez par le chemin réel
				},
				{
					title: "Section",
					url: "/section", // Remplacez par le chemin réel
				},
				{
					title: "Étudiants",
					url: "/etudiants", // Remplacez par le chemin réel
				},
				{
					title: "Professeurs",
					url: "/professeurs", // Remplacez par le chemin réel
				},
				{
					title: "Éducateurs",
					url: "/educateurs", // Remplacez par le chemin réel
				},
				{
					title: "Présences",
					url: "/presences", // Remplacez par le chemin réel
				},
			],
		},
		{
			title: "Gestion",
			url: "/manage",
			items: [{ title: "Etudiants", url: "/manage/student" }],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<div className="flex justify-center ">
					<Image
						src={heplLogo}
						alt="Hepl icon"
						width="100"
						height="50"
						className="rounded-3xl overflow-hidden"
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				{/* We create a SidebarGroup for each parent. */}
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((subItem) => (
									<SidebarMenuItem key={subItem.title}>
										<SidebarMenuButton asChild>
											<a href={subItem.url}>
												{subItem.title}
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
