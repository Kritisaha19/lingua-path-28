import type { Exercise } from "@/lib/types";
import { getTranslation } from "@/lib/lesson-utils";
import { EmptyState } from "@/components/ui/states";

export function FillBlankExercise({
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
  const question = exercise.question ?? "";
  const filled =
    selected && question.includes("___")
      ? question.replace("___", selected)
      : question;
  const translation = getTranslation(exercise.extraData);
  const options = exercise.options ?? [];

  return (
    <div>
      <div className="card-soft mb-6 p-6 text-center">
        <p className="text-2xl font-extrabold text-foreground">
          {filled || "—"}
        </p>
        {translation ? (
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            “{translation}”
          </p>
        ) : null}
      </div>
      {options.length === 0 ? (
        <EmptyState message="No options provided for this exercise." />
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {options.map((option) => (
            <button
              key={option}
              disabled={disabled}
              onClick={() => onSelect(option)}
              className={`rounded-2xl border-2 px-5 py-3 text-base font-bold transition-colors ${
                selected === option
                  ? "border-secondary bg-secondary/10 text-secondary"
                  : "border-border bg-card text-foreground hover:bg-muted"
              } disabled:cursor-not-allowed`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}