import { Flame, Trophy, Zap } from "lucide-react";
import type { Progress, User } from "@/lib/types";
import { formatJoinedDate } from "@/lib/lesson-utils";

export function ProfileHeader({
  user,
  progress,
}: {
  user: User;
  progress: Progress | null;
}) {
  return (
    <div className="card-soft p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary text-2xl font-extrabold text-secondary-foreground">
          {user.avatarInitials}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{user.name}</h1>
          <p className="text-sm font-semibold text-muted-foreground">
            Learning {user.learningLanguage}
          </p>
          <p className="text-xs font-semibold text-muted-foreground">
            Joined {formatJoinedDate(user.joinedAt)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat
          icon={<Flame className="h-5 w-5 text-streak" />}
          value={progress?.streak ?? 0}
          label="Day streak"
        />
        <Stat
          icon={<Zap className="h-5 w-5 text-accent" />}
          value={progress?.xp ?? 0}
          label="Total XP"
        />
        <Stat
          icon={<Trophy className="h-5 w-5 text-primary" />}
          value={progress?.lessonsCompleted ?? 0}
          label="Lessons"
        />
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-border p-3 text-center">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1 text-lg font-extrabold text-foreground">{value}</p>
      <p className="text-[11px] font-bold uppercase text-muted-foreground">
        {label}
      </p>
    </div>
  );
}