import { Gem, HeartCrack, Zap } from "lucide-react";
import { DuoButton } from "@/components/ui/duo-button";
import type { CompleteResponse } from "@/lib/types";

export function LessonComplete({
  result,
  mistakes,
  onContinue,
}: {
  result: CompleteResponse | null;
  mistakes: number;
  onContinue: () => void;
}) {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="text-6xl">🎉</div>
      <h1 className="mt-4 text-3xl font-extrabold text-primary">
        Lesson complete!
      </h1>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">
        Great work — keep the streak alive.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <Stat
          icon={<Zap className="h-5 w-5 text-accent" />}
          label="XP earned"
          value={result?.xpEarned ?? 0}
        />
        <Stat
          icon={<Gem className="h-5 w-5 text-gem" />}
          label="Gems"
          value={result?.gems ?? 0}
        />
        <Stat
          icon={<HeartCrack className="h-5 w-5 text-destructive" />}
          label="Mistakes"
          value={result?.mistakes ?? mistakes}
        />
      </div>

      {result ? (
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Total XP {result.totalXp}
        </p>
      ) : null}

      <div className="mt-8">
        <DuoButton full onClick={onContinue}>
          Continue
        </DuoButton>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="card-soft p-4">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-2 text-xl font-extrabold text-foreground">{value}</p>
      <p className="text-[11px] font-bold uppercase text-muted-foreground">
        {label}
      </p>
    </div>
  );
}