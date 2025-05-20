"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full mt-10">
          <div className="mx-10 pt-10 sm: pt-5 mx-3">
            <Card className="p-5 sm: p-0">{children}</Card>
          </div>
          <Toaster />
        </main>
      </SidebarProvider>
    </>
  );
};

export default AuthenticatedLayout;
