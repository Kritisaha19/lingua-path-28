import type { Exercise } from "@/lib/types";
import { EmptyState } from "@/components/ui/states";
import { DuoButton } from "@/components/ui/duo-button";

export function WordBankExercise({
  exercise,
  selectedWords,
  onChangeWords,
  disabled,
}: {
  exercise: Exercise;
  selectedWords: number[];
  onChangeWords: (indexes: number[]) => void;
  disabled: boolean;
}) {
  const options = exercise.options ?? [];

  return (
    <div>
      {exercise.question ? (
        <div className="card-soft mb-6 p-6 text-center text-xl font-extrabold text-foreground">
          {exercise.question}
        </div>
      ) : null}

      <div className="mb-6 min-h-16 rounded-2xl border-b-2 border-dashed border-border p-3">
        <div className="flex flex-wrap gap-2">
          {selectedWords.map((idx, position) => (
            <button
              key={`${idx}-${position}`}
              disabled={disabled}
              onClick={() =>
                onChangeWords(selectedWords.filter((_, i) => i !== position))
              }
              className="rounded-xl border-2 border-border bg-card px-4 py-2 font-bold text-foreground disabled:cursor-not-allowed"
            >
              {options[idx]}
            </button>
          ))}
          {selectedWords.length === 0 ? (
            <span className="px-2 py-2 text-sm font-semibold text-muted-foreground">
              Tap the words to build the sentence
            </span>
          ) : null}
        </div>
      </div>

      {options.length === 0 ? (
        <EmptyState message="No words available for this exercise." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((word, idx) =>
            selectedWords.includes(idx) ? (
              <span
                key={idx}
                className="rounded-xl border-2 border-border bg-muted px-4 py-2 font-bold text-transparent"
              >
                {word}
              </span>
            ) : (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => onChangeWords([...selectedWords, idx])}
                className="rounded-xl border-2 border-border bg-card px-4 py-2 font-bold text-foreground shadow-[0_2px_0_0_var(--border)] transition-colors hover:bg-muted disabled:cursor-not-allowed"
              >
                {word}
              </button>
            ),
          )}
        </div>
      )}

      {selectedWords.length > 0 && !disabled ? (
        <div className="mt-4">
          <DuoButton variant="ghost" onClick={() => onChangeWords([])}>
            Clear
          </DuoButton>
        </div>
      ) : null}
    </div>
  );
}