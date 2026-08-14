import { createFileRoute } from "@tanstack/react-router";
import {
  AppShell,
  useProgressQuery,
  useUserQuery,
} from "@/components/layout/AppShell";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Lingolumo" },
      {
        name: "description",
        content:
          "See how your weekly XP stacks up against other Lingolumo learners in the Emerald League.",
      },
      { property: "og:title", content: "Leaderboard — Lingolumo" },
      {
        property: "og:description",
        content: "Climb the Emerald League by earning XP every day.",
      },
    ],
  }),
  component: LeaderboardRoute,
});

function LeaderboardRoute() {
  const user = useUserQuery();
  const progress = useProgressQuery();
  return (
    <AppShell>
      <Leaderboard user={user.data ?? null} progress={progress.data ?? null} />
    </AppShell>
  );
}