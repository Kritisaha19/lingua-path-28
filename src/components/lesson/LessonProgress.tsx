import { Heart, X } from "lucide-react";

export function LessonProgress({
  current,
  total,
  hearts,
  maxHearts,
  onExit,
}: {
  current: number;
  total: number;
  hearts: number;
  maxHearts: number;
  onExit: () => void;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onExit}
        aria-label="Exit lesson"
        className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center gap-1 text-destructive">
        {Array.from({ length: Math.max(maxHearts, 0) }).map((_, i) => (
          <Heart
            key={i}
            className={`h-5 w-5 ${i < hearts ? "fill-current" : "text-border"}`}
          />
        ))}
      </div>
    </div>
  );
}