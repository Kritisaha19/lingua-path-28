import type { Exercise } from "@/lib/types";

export function TypeAnswerExercise({
  exercise,
  value,
  onChange,
  disabled,
}: {
  exercise: Exercise;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div>
      {exercise.question ? (
        <div className="card-soft mb-6 p-6 text-center text-2xl font-extrabold text-foreground">
          {exercise.question}
        </div>
      ) : null}
      <textarea
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Type your answer…"
        className="w-full resize-none rounded-2xl border-2 border-border bg-card p-4 text-lg font-semibold text-foreground outline-none transition-colors focus:border-secondary disabled:opacity-70"
      />
    </div>
  );
}