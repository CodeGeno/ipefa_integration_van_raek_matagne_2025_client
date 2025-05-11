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
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Tableau de bord",
      url: "/",
      icon: <BookOpen className="size-4" />,
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
      title: "Profil",
      url: "/profile",
      icon: <UserCircle className="size-4" />,
    },
    {
      title: "Paramètres",
      url: "/settings",
      icon: <Settings className="size-4" />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarGroup>
            {index < data.navMain.length - 1 && (
              <div className="h-px bg-border/40 mx-4 my-2" />
            )}
          </React.Fragment>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
