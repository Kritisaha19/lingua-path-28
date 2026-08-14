import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Progress, Unit } from "@/lib/types";
import { SkillNode, type SkillState } from "./SkillNode";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";

const OFFSETS = [0, 56, 88, 56, 0, -56, -88, -56];

export function UnitCard({
  unit,
  progress,
  unlockAll,
}: {
  unit: Unit;
  progress: Progress | null;
  unlockAll: boolean;
}) {
  const skills = useQuery({
    queryKey: ["skills", unit.id],
    queryFn: () => api.getSkills(unit.id),
  });

  const completedIds = progress?.completedSkillIds ?? [];
  const activeId = progress?.activeSkillId ?? null;

  function stateFor(skillId: number, index: number): SkillState {
    if (completedIds.includes(skillId)) return "completed";
    if (activeId !== null && skillId === activeId) return "active";
    if (unlockAll) return "available";
    const previous = skills.data?.[index - 1];
    if (index === 0 && activeId === null && completedIds.length === 0)
      return "available";
    if (previous && completedIds.includes(previous.id)) return "available";
    return "locked";
  }

  return (
    <section className="mb-10">
      <div
        className="flex items-center justify-between rounded-2xl px-5 py-4 text-primary-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.12)]"
        style={{ backgroundColor: unit.color ?? "#58CC02" }}
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide opacity-90">
            Unit {unit.unitIndex}
          </p>
          <h2 className="text-xl font-extrabold">{unit.title}</h2>
          {unit.subtitle ? (
            <p className="text-sm opacity-90">{unit.subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-8">
        {skills.isPending ? <LoadingState label="Loading skills…" /> : null}
        {skills.isError ? (
          <ErrorState
            message="Unable to load skills for this unit."
            detail={(skills.error as Error).message}
            onRetry={() => void skills.refetch()}
          />
        ) : null}
        {skills.data && skills.data.length === 0 ? (
          <EmptyState message="No skills in this unit yet." />
        ) : null}
        {(skills.data ?? []).map((skill, index) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            state={stateFor(skill.id, index)}
            offset={OFFSETS[index % OFFSETS.length] ?? 0}
          />
        ))}
      </div>
    </section>
  );
}