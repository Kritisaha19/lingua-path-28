import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, DEFAULT_USER_ID } from "@/lib/api";
import type { CompleteResponse, Exercise } from "@/lib/types";
import { answersMatch } from "@/lib/lesson-utils";
import { ErrorState, LoadingState, EmptyState } from "@/components/ui/states";
import { DuoButton } from "@/components/ui/duo-button";
import { LessonProgress } from "./LessonProgress";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise";
import { TypeAnswerExercise } from "./TypeAnswerExercise";
import { FillBlankExercise } from "./FillBlankExercise";
import { WordBankExercise } from "./WordBankExercise";
import { LessonComplete } from "./LessonComplete";

type Phase = "answering" | "checked" | "finished";

export function LessonPlayer({ lessonId }: { lessonId: number }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const lesson = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => api.getLesson(lessonId),
  });
  const progress = useQuery({
    queryKey: ["progress", DEFAULT_USER_ID],
    queryFn: () => api.getProgress(DEFAULT_USER_ID),
  });

  const maxHearts = progress.data?.maxHearts ?? 5;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [wasCorrect, setWasCorrect] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [heartsLost, setHeartsLost] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [words, setWords] = useState<number[]>([]);
  const [completion, setCompletion] = useState<CompleteResponse | null>(null);

  const answerMutation = useMutation({
    mutationFn: (payload: { correct: boolean; correctAnswer: string | null }) =>
      api.submitAnswer(lessonId, payload),
  });

  const completeMutation = useMutation({
    mutationFn: (payload: { xpEarned: number; mistakes: number }) =>
      api.completeLesson(lessonId, { ...payload, userId: DEFAULT_USER_ID }),
    onSuccess: async (data) => {
      setCompletion(data);
      await queryClient.invalidateQueries({
        queryKey: ["progress", DEFAULT_USER_ID],
      });
    },
  });

  if (lesson.isPending) return <LoadingState label="Loading lesson…" />;
  if (lesson.isError)
    return (
      <ErrorState
        message="Unable to load this lesson."
        detail={(lesson.error as Error).message}
        onRetry={() => void lesson.refetch()}
      />
    );

  const exercises: Exercise[] = lesson.data.exercises ?? [];
  if (exercises.length === 0)
    return <EmptyState message="This lesson has no exercises yet." />;

  if (phase === "finished")
    return (
      <LessonComplete
        result={completion}
        mistakes={mistakes}
        onContinue={() => void navigate({ to: "/" })}
      />
    );

  const exercise = exercises[index]!;
  const hearts = Math.max(maxHearts - heartsLost, 0);

  const learnerAnswer =
    exercise.type === "type-answer"
      ? typed
      : exercise.type === "word-bank"
        ? words.map((i) => exercise.options?.[i] ?? "").join(" ")
        : (choice ?? "");

  const canCheck = learnerAnswer.trim().length > 0;

  function resetInputs() {
    setChoice(null);
    setTyped("");
    setWords([]);
  }

  function handleCheck() {
    const correct = answersMatch(learnerAnswer, exercise.answer);
    setWasCorrect(correct);
    setPhase("checked");
    if (!correct) {
      setMistakes((m) => m + 1);
      setHeartsLost((h) => h + 1);
    }
    answerMutation.mutate({ correct, correctAnswer: exercise.answer });
  }

  function handleContinue() {
    if (index + 1 < exercises.length) {
      setIndex((i) => i + 1);
      setPhase("answering");
      resetInputs();
      return;
    }
    setPhase("finished");
    completeMutation.mutate({
      xpEarned: lesson.data?.xpReward ?? 0,
      mistakes,
    });
  }

  const locked = phase === "checked";

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-5">
      <LessonProgress
        current={index}
        total={exercises.length}
        hearts={hearts}
        maxHearts={maxHearts}
        onExit={() => void navigate({ to: "/" })}
      />

      <div className="flex-1 py-8">
        <h1 className="mb-6 text-2xl font-extrabold text-foreground">
          {exercise.prompt ?? lesson.data.title}
        </h1>

        {exercise.type === "multiple-choice" ? (
          <MultipleChoiceExercise
            exercise={exercise}
            selected={choice}
            onSelect={setChoice}
            disabled={locked}
          />
        ) : exercise.type === "type-answer" ? (
          <TypeAnswerExercise
            exercise={exercise}
            value={typed}
            onChange={setTyped}
            disabled={locked}
          />
        ) : exercise.type === "fill-blank" ? (
          <FillBlankExercise
            exercise={exercise}
            selected={choice}
            onSelect={setChoice}
            disabled={locked}
          />
        ) : exercise.type === "word-bank" ? (
          <WordBankExercise
            exercise={exercise}
            selectedWords={words}
            onChangeWords={setWords}
            disabled={locked}
          />
        ) : (
          <EmptyState
            message={`Exercise type "${exercise.type}" is not supported yet.`}
          />
        )}
      </div>

      <div
        className={`sticky bottom-0 -mx-4 border-t-2 px-4 py-4 transition-colors ${
          phase === "checked"
            ? wasCorrect
              ? "border-success bg-success-soft"
              : "border-destructive bg-danger-soft"
            : "border-border bg-background"
        }`}
      >
        {phase === "checked" ? (
          <div className="mb-3">
            <p
              className={`text-lg font-extrabold ${
                wasCorrect ? "text-success" : "text-destructive"
              }`}
            >
              {wasCorrect ? "Nice! That's correct." : "Not quite."}
            </p>
            {!wasCorrect && exercise.answer ? (
              <p className="text-sm font-bold text-destructive">
                Correct answer: {exercise.answer}
              </p>
            ) : null}
          </div>
        ) : null}

        {phase === "answering" ? (
          <DuoButton full disabled={!canCheck} onClick={handleCheck}>
            Check
          </DuoButton>
        ) : (
          <DuoButton
            full
            variant={wasCorrect ? "primary" : "danger"}
            onClick={handleContinue}
          >
            Continue
          </DuoButton>
        )}
      </div>
    </div>
  );
}