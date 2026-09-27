import UserGrid from "@/components/UserGrid";
import AppSidebar from "@/components/AppSidebar";

export default function UsersPage() {
  return <AppSidebar><main className="h-[calc(100vh-3.5rem)] min-h-[400px] p-3"><UserGrid /></main></AppSidebar>;
}
