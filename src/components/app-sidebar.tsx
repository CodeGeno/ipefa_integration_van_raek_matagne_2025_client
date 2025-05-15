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
import {
	BookOpen,
	Users,
	GraduationCap,
	Calendar,
	UserCircle,
	Building2,
	ClipboardList,
	Settings,
	LogOut,
} from "lucide-react";
import { AccountContext } from "@/app/context";
import { useContext } from "react";
import { useRouter } from "next/navigation";

// Types pour la structure des liens
type SidebarSubItem = {
	title: string;
	url: string;
	icon: React.ReactNode;
};

type SidebarItem = {
	title: string;
	url: string;
	icon: React.ReactNode;
	items?: SidebarSubItem[];
};

type SidebarLinksData = {
	navMain: SidebarItem[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();
	const AdminLinks: SidebarLinksData = {
		navMain: [
			{
				title: "Tableau de bord",
				url: "/",
				icon: <BookOpen className="size-4" />,
			},
			{
				title: "Profil",
				url: "/profile",
				icon: <UserCircle className="size-4" />,
			},
			{
				title: "Gestion académique",
				url: "#",
				icon: <GraduationCap className="size-4" />,
				items: [
					{
						title: "Unités d'enseignement",
						url: "/ue",
						icon: <BookOpen className="size-4" />,
					},
					{
						title: "UE académiques",
						url: "/academics-ue",
						icon: <ClipboardList className="size-4" />,
					},
					{
						title: "Sections",
						url: "/section/list",
						icon: <Building2 className="size-4" />,
					},
				],
			},
			{
				title: "Gestion des utilisateurs",
				url: "#",
				icon: <Users className="size-4" />,
				items: [
					{
						title: "Étudiants",
						url: "/student/list",
						icon: <GraduationCap className="size-4" />,
					},
					{
						title: "Employés",
						url: "/employee/list",
						icon: <Users className="size-4" />,
					},
				],
			},
			{
				title: "Présences",
				url: "/presences",
				icon: <Calendar className="size-4" />,
			},

			{
				title: "Paramètres",
				url: "/settings",
				icon: <Settings className="size-4" />,
			},
			{
				title: "Déconnexion",
				url: "/logout",
				icon: <LogOut className="size-4" />,
			},
		],
	};

	const EducatorLinks: SidebarLinksData = {
		navMain: [
			{
				title: "Tableau de bord",
				url: "/",
				icon: <BookOpen className="size-4" />,
			},
			{
				title: "Profil",
				url: "/profile",
				icon: <UserCircle className="size-4" />,
			},
			{
				title: "Sections",
				url: "/section/list",
				icon: <Building2 className="size-4" />,
			},
			{
				title: "UE académiques",
				url: "/academics-ue",
				icon: <ClipboardList className="size-4" />,
			},
			{
				title: "Déconnexion",
				url: "/logout",
				icon: <LogOut className="size-4" />,
			},
		],
	};

	const StudentLinks: SidebarLinksData = {
		navMain: [
			{
				title: "Tableau de bord",
				url: "/",
				icon: <BookOpen className="size-4" />,
			},
			{
				title: "Profil",
				url: "/profile",
				icon: <UserCircle className="size-4" />,
			},
			{
				title: "Déconnexion",
				url: "/logout",
				icon: <LogOut className="size-4" />,
			},
		],
	};

	const ProfessorLinks: SidebarLinksData = {
		navMain: [
			{
				title: "Tableau de bord",
				url: "/",
				icon: <BookOpen className="size-4" />,
			},
			{
				title: "Profil",
				url: "/profile",
				icon: <UserCircle className="size-4" />,
			},
			{
				title: "Mes cours",
				url: "/academics-ue/",
				icon: <ClipboardList className="size-4" />,
			},
			{
				title: "Déconnexion",
				url: "/logout",
				icon: <LogOut className="size-4" />,
			},
		],
	};

	const { accountData } = useContext(AccountContext);

	const defineLinks = (): SidebarLinksData => {
		switch (accountData?.role) {
			case "ADMINISTRATOR":
				return AdminLinks;
			case "EDUCATOR":
				return EducatorLinks;
			case "STUDENT":
				return StudentLinks;
			case "PROFESSOR":
				return ProfessorLinks;
			default:
				return { navMain: [] };
		}
	};

	const data = defineLinks();

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<div className="flex justify-center p-4">
					<Image
						src={heplLogo}
						alt="Hepl icon"
						width="120"
						height="60"
						className="rounded-3xl overflow-hidden"
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				{data.navMain.map((item, index) => (
					<React.Fragment key={item.title}>
						<SidebarGroup>
							{item.items ? (
								<>
									<SidebarGroupLabel className="flex items-center gap-2">
										{item.icon}
										{item.title}
									</SidebarGroupLabel>
									<SidebarGroupContent>
										<SidebarMenu>
											{item.items.map((subItem) => (
												<SidebarMenuItem
													key={subItem.title}
													className="list-none"
												>
													<SidebarMenuButton asChild>
														<a
															href={subItem.url}
															className="flex items-center gap-2"
														>
															{subItem.icon}
															{subItem.title}
														</a>
													</SidebarMenuButton>
												</SidebarMenuItem>
											))}
										</SidebarMenu>
									</SidebarGroupContent>
								</>
							) : (
								<SidebarMenuItem className="list-none">
									<SidebarMenuButton
										asChild
										className="flex items-center gap-2"
									>
										<a href={item.url}>
											{item.icon}
											{item.title}
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)}
						</SidebarGroup>
					</React.Fragment>
				))}
			</SidebarContent>
		</Sidebar>
	);
}
