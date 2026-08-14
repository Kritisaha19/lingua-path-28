import { createFileRoute } from "@tanstack/react-router";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { ErrorState } from "@/components/ui/states";

export const Route = createFileRoute("/lesson/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lesson — Lingolumo" },
      {
        name: "description",
        content:
          "Practice Spanish with multiple choice, typing, fill-in-the-blank and word bank exercises.",
      },
      { property: "og:title", content: "Lesson — Lingolumo" },
      {
        property: "og:description",
        content: "Immediate feedback, hearts and XP on every exercise.",
      },
    ],
  }),
  component: LessonRoute,
});

function LessonRoute() {
  const { lessonId } = Route.useParams();
  const parsed = Number(lessonId);

  if (!Number.isFinite(parsed))
    return <ErrorState message="That lesson id is not valid." />;

  return <LessonPlayer lessonId={parsed} />;
}