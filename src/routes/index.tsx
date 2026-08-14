import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useProgressQuery } from "@/components/layout/AppShell";
import { LearningPath } from "@/components/learning/LearningPath";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lingolumo — Learn Spanish with bite-sized lessons" },
      {
        name: "description",
        content:
          "Follow a playful skill tree, earn XP, keep your streak and master Spanish one short lesson at a time.",
      },
      { property: "og:title", content: "Lingolumo — Learn Spanish daily" },
      {
        property: "og:description",
        content:
          "A Duolingo-style learning path with hearts, XP, gems and daily goals.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const progress = useProgressQuery();
  return (
    <AppShell>
      <LearningPath progress={progress.data ?? null} />
    </AppShell>
  );
}
