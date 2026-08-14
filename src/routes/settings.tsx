import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useUserQuery } from "@/components/layout/AppShell";
import { Settings } from "@/components/settings/Settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Lingolumo" },
      {
        name: "description",
        content:
          "Manage your profile, learning language, reminders, sound and appearance preferences.",
      },
      { property: "og:title", content: "Settings — Lingolumo" },
      {
        property: "og:description",
        content: "Tune notifications, sound and appearance for your lessons.",
      },
    ],
  }),
  component: SettingsRoute,
});

function SettingsRoute() {
  const user = useUserQuery();
  return (
    <AppShell>
      <Settings user={user.data ?? null} />
    </AppShell>
  );
}