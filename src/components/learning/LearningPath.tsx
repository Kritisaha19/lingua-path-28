import { useQuery } from "@tanstack/react-query";
import { Flame, Target } from "lucide-react";
import { api } from "@/lib/api";
import type { Course, Progress } from "@/lib/types";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { UnitCard } from "./UnitCard";

function DailyGoal({ progress }: { progress: Progress | null }) {
  const goal = progress?.dailyGoal ?? 0;
  const done = progress?.dailyXp ?? 0;
  const pct = goal > 0 ? Math.min(100, Math.round((done / goal) * 100)) : 0;
  return (
    <div className="card-soft p-4">
      <div className="flex items-center justify-between text-sm font-extrabold">
        <span className="flex items-center gap-2 text-foreground">
          <Target className="h-4 w-4 text-primary" /> Daily goal
        </span>
        <span className="text-muted-foreground">
          {done} / {goal} XP
        </span>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-semibold text-muted-foreground">
        {progress ? `${progress.lessonsCompleted} lessons completed` : "—"}
      </p>
    </div>
  );
}

function CourseHeader({
  course,
  progress,
}: {
  course: Course;
  progress: Progress | null;
}) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-[2fr_1fr]">
      <div className="card-soft flex items-center gap-4 p-4">
        <span className="text-4xl">{course.flag}</span>
        <div>
          <h1 className="text-xl font-extrabold text-foreground">{course.title}</h1>
          <p className="text-sm font-semibold text-muted-foreground">
            {course.language} · {course.totalSkills} skills
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-streak">
            <Flame className="h-3.5 w-3.5" /> {progress?.streak ?? 0} day streak
          </p>
        </div>
      </div>
      <DailyGoal progress={progress} />
    </div>
  );
}

export function LearningPath({ progress }: { progress: Progress | null }) {
  const courses = useQuery({ queryKey: ["courses"], queryFn: api.getCourses });
  const course = courses.data?.[0] ?? null;

  const units = useQuery({
    queryKey: ["units", course?.id],
    queryFn: () => api.getUnits(course!.id),
    enabled: course !== null,
  });

  if (courses.isPending) return <LoadingState label="Loading your course…" />;
  if (courses.isError)
    return (
      <ErrorState
        message="Unable to load your learning path."
        detail={(courses.error as Error).message}
        onRetry={() => void courses.refetch()}
      />
    );
  if (!course) return <EmptyState message="No courses available yet." />;

  const unlockAll =
    (progress?.completedSkillIds ?? []).length === 0 &&
    (progress?.activeSkillId ?? null) === null;

  return (
    <div>
      <CourseHeader course={course} progress={progress} />
      {units.isPending ? <LoadingState label="Loading units…" /> : null}
      {units.isError ? (
        <ErrorState
          message="Unable to load your learning path."
          detail={(units.error as Error).message}
          onRetry={() => void units.refetch()}
        />
      ) : null}
      {units.data && units.data.length === 0 ? (
        <EmptyState message="This course has no units yet." />
      ) : null}
      {(units.data ?? []).map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          progress={progress}
          unlockAll={unlockAll}
        />
      ))}
    </div>
  );
}