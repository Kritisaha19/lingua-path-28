import type { Exercise } from "@/lib/types";
import { getTranslation } from "@/lib/lesson-utils";

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
  const translation = getTranslation(exercise.extraData);

  // Backend currently sends options: null for fill-blank.
  // Build the choices from the answer so the existing API schema
  // remains unchanged.
  const options =
    exercise.options && exercise.options.length > 0
      ? exercise.options
      : exercise.answer
        ? [exercise.answer]
        : [];

  const filled =
    selected && question.includes("___")
      ? question.replace("___", selected)
      : question;

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

      {options.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {options.map((option) => (
            <button
              key={option}
              type="button"
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
      ) : (
        <p className="text-center text-sm font-semibold text-muted-foreground">
          No answer available for this exercise.
        </p>
      )}
    </div>
  );
}
