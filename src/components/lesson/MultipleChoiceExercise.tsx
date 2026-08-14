import type { Exercise } from "@/lib/types";
import { EmptyState } from "@/components/ui/states";

export function MultipleChoiceExercise({
  exercise,
  selected,
  onSelect,
  disabled,
}: {
  exercise: Exercise;
  selected: string | null;
  onSelect: (value: string) => void;
  disabled: boolean;
}) {
  const options = exercise.options ?? [];
  return (
    <div>
      {exercise.question ? (
        <div className="card-soft mb-6 p-6 text-center text-2xl font-extrabold text-foreground">
          {exercise.question}
        </div>
      ) : null}
      {options.length === 0 ? (
        <EmptyState message="This exercise has no options to show." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selected === option;
            return (
              <button
                key={option}
                disabled={disabled}
                onClick={() => onSelect(option)}
                className={`rounded-2xl border-2 px-5 py-4 text-left text-base font-bold transition-colors ${
                  isSelected
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border bg-card text-foreground hover:bg-muted"
                } disabled:cursor-not-allowed`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}