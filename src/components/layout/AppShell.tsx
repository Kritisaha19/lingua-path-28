import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, DEFAULT_USER_ID } from "@/lib/api";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function useUserQuery() {
  return useQuery({
    queryKey: ["user", DEFAULT_USER_ID],
    queryFn: () => api.getUser(DEFAULT_USER_ID),
  });
}

export function useProgressQuery() {
  return useQuery({
    queryKey: ["progress", DEFAULT_USER_ID],
    queryFn: () => api.getProgress(DEFAULT_USER_ID),
  });
}

export function AppShell({ children }: { children: ReactNode }) {
  const user = useUserQuery();
  const progress = useProgressQuery();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar user={user.data ?? null} progress={progress.data ?? null} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}