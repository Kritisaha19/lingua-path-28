import { Link } from "@tanstack/react-router";
import { Check, Lock, Star } from "lucide-react";
import type { Skill } from "@/lib/types";

export type SkillState = "completed" | "active" | "available" | "locked";

export function SkillNode({
  skill,
  state,
  offset,
}: {
  skill: Skill;
  state: SkillState;
  offset: number;
}) {
  const locked = state === "locked";

  const ring =
    state === "completed"
      ? "bg-accent shadow-[0_6px_0_0_oklch(0.68_0.15_85)]"
      : state === "locked"
        ? "bg-muted shadow-[0_6px_0_0_var(--border)]"
        : "bg-primary shadow-[0_6px_0_0_var(--primary-shadow)]";

  const inner = (
    <div className="flex flex-col items-center gap-2" style={{ marginLeft: offset }}>
      <div className="relative">
        <div
          className={`grid h-20 w-20 place-items-center rounded-full text-3xl transition-transform ${ring} ${
            locked ? "text-muted-foreground" : "text-primary-foreground"
          } ${!locked ? "hover:-translate-y-0.5" : ""}`}
        >
          {locked ? (
            <Lock className="h-7 w-7" />
          ) : state === "completed" ? (
            <Check className="h-8 w-8" strokeWidth={3} />
          ) : (
            <span>{skill.icon ?? "📘"}</span>
          )}
        </div>
        {state === "active" ? (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold uppercase text-secondary-foreground">
            Start
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-0.5">
        {Array.from({ length: Math.max(skill.maxCrowns, 0) }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < skill.crowns
                ? "fill-accent text-accent"
                : "text-border"
            }`}
          />
        ))}
      </div>
      <p className="max-w-[9rem] text-center text-sm font-extrabold text-foreground">
        {skill.title}
      </p>
      {skill.description ? (
        <p className="max-w-[11rem] text-center text-xs text-muted-foreground">
          {skill.description}
        </p>
      ) : null}
    </div>
  );

  if (locked) {
    return (
      <div className="cursor-not-allowed opacity-70" title="Complete earlier skills first">
        {inner}
      </div>
    );
  }

  return (
    <Link
      to="/lesson/$lessonId"
      params={{ lessonId: String(skill.lessonId) }}
      className="block"
    >
      {inner}
    </Link>
  );
}