"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, LogOut, PanelLeft, Users } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/me").then((response) => response.ok ? response.json() : null).then((result) => setIsAdmin(result?.data?.role === 1));
  }, [pathname]);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return <TooltipProvider><SidebarProvider>
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/notes"><span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><PanelLeft className="size-4" /></span><span className="flex flex-col gap-0.5"><span className="font-semibold tracking-tight">Notely</span><span className="text-[11px] text-muted-foreground">Your quiet workspace</span></span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton asChild tooltip="Notes" isActive={pathname === "/notes"}><Link href="/notes"><FileText /><span>Notes</span></Link></SidebarMenuButton></SidebarMenuItem>
              {isAdmin && <SidebarMenuItem><SidebarMenuButton asChild tooltip="Users" isActive={pathname === "/users"}><Link href="/users"><Users /><span>Users</span></Link></SidebarMenuButton></SidebarMenuItem>}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu><SidebarMenuItem><SidebarMenuButton onClick={logout} tooltip="Logout" className="text-slate-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100"><LogOut className="size-4 shrink-0" /><span>Logout</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset className="bg-background"><header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background/90 px-5 backdrop-blur"><SidebarTrigger /><div className="ml-auto text-xs text-muted-foreground">A little space to think clearly</div></header>{children}</SidebarInset>
  </SidebarProvider></TooltipProvider>;
}
