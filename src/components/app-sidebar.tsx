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
import Link from "next/link";
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
import { useToast } from "@/hooks/use-toast";

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
  onClick?: () => void;
};

type SidebarLinksData = {
  navMain: SidebarItem[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { accountData, setAccountData } = useContext(AccountContext);
  const { toast } = useToast();

  const handleLogout = () => {
    // Supprimer les données du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Réinitialiser le contexte
    setAccountData({
      token: "",
      role: "",
      account: undefined,
    });

    // Afficher un message de confirmation
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });

    // Rediriger vers la page de login
    router.push("/login");
  };

  const AdminLinks: SidebarLinksData = {
    navMain: [
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
        title: "Paramètres",
        url: "/settings",
        icon: <Settings className="size-4" />,
      },
      {
        title: "Déconnexion",
        url: "#",
        icon: <LogOut className="size-4" />,
        onClick: handleLogout,
      },
    ],
  };

  const EducatorLinks: SidebarLinksData = {
    navMain: [
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
        ],
      },
      {
        title: "Paramètres",
        url: "/settings",
        icon: <Settings className="size-4" />,
      },
      {
        title: "Déconnexion",
        url: "#",
        icon: <LogOut className="size-4" />,
        onClick: handleLogout,
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
        title: "Paramètres",
        url: "/settings",
        icon: <Settings className="size-4" />,
      },
      {
        title: "Déconnexion",
        url: "#",
        icon: <LogOut className="size-4" />,
        onClick: handleLogout,
      },
    ],
  };

  const ProfessorLinks: SidebarLinksData = {
    navMain: [
      {
        title: "Mes cours",
        url: "/academics-ue/",
        icon: <ClipboardList className="size-4" />,
      },
      {
        title: "Paramètres",
        url: "/settings",
        icon: <Settings className="size-4" />,
      },
      {
        title: "Déconnexion",
        url: "#",
        icon: <LogOut className="size-4" />,
        onClick: handleLogout,
      },
    ],
  };

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
            {item.items ? (
              <SidebarGroup>
                <SidebarGroupLabel>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <Link href={subItem.url} passHref legacyBehavior>
                          <SidebarMenuButton asChild>
                            <a>
                              {subItem.icon}
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : (
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    {item.onClick ? (
                      <SidebarMenuButton onClick={item.onClick}>
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    ) : (
                      <Link href={item.url} passHref legacyBehavior>
                        <SidebarMenuButton asChild>
                          <a>
                            {item.icon}
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    )}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )}
          </React.Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
