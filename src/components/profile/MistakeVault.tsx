import type { Mistake } from "@/lib/types";
import { EmptyState } from "@/components/ui/states";

export function MistakeVault({ mistakes }: { mistakes: Mistake[] }) {
  if (mistakes.length === 0)
    return <EmptyState message="No mistakes yet — great work!" />;

  return (
    <ul className="space-y-2">
      {mistakes.map((mistake) => (
        <li
          key={mistake.id}
          className="card-soft flex items-center justify-between p-4"
        >
          <div>
            <p className="text-sm font-extrabold text-foreground">
              {mistake.term}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">
              {mistake.translation}
              {mistake.skillTitle ? ` · ${mistake.skillTitle}` : ""}
            </p>
          </div>
          <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-extrabold text-destructive">
            ×{mistake.count}
          </span>
        </li>
      ))}
    </ul>
  );
}