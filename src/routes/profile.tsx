import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api, DEFAULT_USER_ID } from "@/lib/api";
import {
  AppShell,
  useProgressQuery,
  useUserQuery,
} from "@/components/layout/AppShell";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  ACHIEVEMENTS,
  AchievementCard,
} from "@/components/profile/AchievementCard";
import { MistakeVault } from "@/components/profile/MistakeVault";
import { ErrorState, LoadingState } from "@/components/ui/states";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Lingolumo" },
      {
        name: "description",
        content:
          "Track your streak, XP, lessons completed, achievements and the words you keep getting wrong.",
      },
      { property: "og:title", content: "Your profile — Lingolumo" },
      {
        property: "og:description",
        content: "Streaks, XP, achievements and your personal mistake vault.",
      },
    ],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  const user = useUserQuery();
  const progress = useProgressQuery();
  const mistakes = useQuery({
    queryKey: ["mistakes", DEFAULT_USER_ID],
    queryFn: () => api.getMistakes(DEFAULT_USER_ID),
  });

  return (
    <AppShell>
      {user.isPending ? <LoadingState label="Loading your profile…" /> : null}
      {user.isError ? (
        <ErrorState
          message="Unable to load your profile."
          detail={(user.error as Error).message}
          onRetry={() => void user.refetch()}
        />
      ) : null}

      {user.data ? (
        <>
          <ProfileHeader user={user.data} progress={progress.data ?? null} />

          <h2 className="mb-3 mt-8 text-lg font-extrabold text-foreground">
            Achievements
          </h2>
          <p className="mb-3 text-xs font-semibold text-muted-foreground">
            Presentation-only badges derived from your live progress.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {ACHIEVEMENTS.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={achievement.isUnlocked(progress.data ?? null)}
              />
            ))}
          </div>

          <h2 className="mb-3 mt-8 text-lg font-extrabold text-foreground">
            Mistake vault
          </h2>
          {mistakes.isPending ? <LoadingState label="Loading mistakes…" /> : null}
          {mistakes.isError ? (
            <ErrorState
              message="Unable to load your mistakes."
              detail={(mistakes.error as Error).message}
              onRetry={() => void mistakes.refetch()}
            />
          ) : null}
          {mistakes.data ? <MistakeVault mistakes={mistakes.data} /> : null}
        </>
      ) : null}
    </AppShell>
  );
}