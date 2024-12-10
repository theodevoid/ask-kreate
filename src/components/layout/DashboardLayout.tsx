import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "../ui/button";
import { supabase } from "~/lib/supabase/client";
import { useAuth } from "~/hooks/useAuth";

export const DashboardLayout = (props: PropsWithChildren) => {
  const router = useRouter();

  const { user, isLoading: userIsLoading } = useAuth();

  const onLogout = () => {
    void supabase.auth.signOut();
  };

  useEffect(() => {
    if (!userIsLoading && !user) {
      void router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIsLoading, user]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-sidebar px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="font-bold">Dashboard</h1>
          </div>

          <div>
            <Button onClick={onLogout} variant="softDestructive">
              Logout
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-secondary/40 p-4 sm:p-8 lg:p-16">
          {props.children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
