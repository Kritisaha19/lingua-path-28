import { Link } from "@tanstack/react-router";
import { Flame, Gem, Heart, Zap } from "lucide-react";
import type { Progress, User } from "@/lib/types";

function Stat({
  icon,
  value,
  className,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  className: string;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-sm font-extrabold ${className}`}
      aria-label={label}
      title={label}
    >
      {icon}
      <span>{value}</span>
    </div>
  );
}

export function TopBar({
  user,
  progress,
}: {
  user: User | null;
  progress: Progress | null;
}) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg shadow-[0_3px_0_0_var(--primary-shadow)]">
            🦉
          </span>
          <span className="hidden text-xl font-extrabold tracking-tight text-primary sm:block">
            Lingolumo
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {[
            { to: "/", label: "Learn" },
            { to: "/leaderboard", label: "Leaderboard" },
            { to: "/profile", label: "Profile" },
            { to: "/settings", label: "Settings" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted [&.active]:bg-muted [&.active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <Stat
            icon={<Flame className="h-4 w-4" />}
            value={progress?.streak ?? "–"}
            className="text-streak"
            label="Streak"
          />
          <Stat
            icon={<Zap className="h-4 w-4" />}
            value={progress?.xp ?? "–"}
            className="text-accent"
            label="Total XP"
          />
          <Stat
            icon={<Heart className="h-4 w-4 fill-current" />}
            value={
              progress ? `${progress.hearts}/${progress.maxHearts}` : "–"
            }
            className="text-destructive"
            label="Hearts"
          />
          <Stat
            icon={<Gem className="h-4 w-4" />}
            value={progress?.gems ?? "–"}
            className="text-gem"
            label="Gems"
          />
          <Link
            to="/profile"
            className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-extrabold text-secondary-foreground"
          >
            {user?.avatarInitials ?? "··"}
          </Link>
        </div>
      </div>
    </header>
  );
}