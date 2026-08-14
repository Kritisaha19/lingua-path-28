import type { Progress, User } from "@/lib/types";

/**
 * SEEDED, PRESENTATION-ONLY leaderboard.
 * The backend exposes no leaderboard endpoint, so the rival rows below are
 * static and isolated in this single file. Only the current learner's row is
 * API-backed (from /api/users/{id} and /api/users/{id}/progress).
 * Replace SEEDED_RIVALS with a real API call when the endpoint exists.
 */
const SEEDED_RIVALS: { name: string; initials: string; xp: number }[] = [
  { name: "Marisol Vega", initials: "MV", xp: 620 },
  { name: "Tomás Rivera", initials: "TR", xp: 480 },
  { name: "Aisha Karim", initials: "AK", xp: 355 },
  { name: "Lena Fischer", initials: "LF", xp: 290 },
  { name: "Daniel Okoye", initials: "DO", xp: 210 },
  { name: "Priya Nair", initials: "PN", xp: 150 },
  { name: "Hugo Blanc", initials: "HB", xp: 95 },
];

export function Leaderboard({
  user,
  progress,
}: {
  user: User | null;
  progress: Progress | null;
}) {
  const rows = [
    ...SEEDED_RIVALS.map((r) => ({ ...r, isMe: false })),
    {
      name: user?.name ?? "You",
      initials: user?.avatarInitials ?? "YU",
      xp: progress?.xp ?? 0,
      isMe: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div>
      <div className="card-soft mb-4 p-5 text-center">
        <p className="text-3xl">🏆</p>
        <h1 className="mt-1 text-xl font-extrabold text-foreground">
          Emerald League
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">
          Top 3 advance to the next league
        </p>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Rivals are seeded demo data — your row is live from the API
        </p>
      </div>

      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li
            key={`${row.name}-${i}`}
            className={`card-soft flex items-center gap-3 p-4 ${
              row.isMe ? "border-primary bg-success-soft" : ""
            }`}
          >
            <span
              className={`w-6 text-center text-sm font-extrabold ${
                i < 3 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-xs font-extrabold text-secondary-foreground">
              {row.initials}
            </span>
            <span className="flex-1 text-sm font-extrabold text-foreground">
              {row.name}
              {row.isMe ? (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase text-primary-foreground">
                  You
                </span>
              ) : null}
            </span>
            <span className="text-sm font-extrabold text-accent">
              {row.xp} XP
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}