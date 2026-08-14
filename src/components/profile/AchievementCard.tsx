import type { Progress } from "@/lib/types";

/**
 * Presentation-only achievements.
 * The backend has no achievements endpoint, so these are statically defined
 * here and unlocked purely from API-backed progress values.
 */
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: (progress: Progress | null) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🌱",
    isUnlocked: (p) => (p?.lessonsCompleted ?? 0) >= 1,
  },
  {
    id: "streak-3",
    title: "On Fire",
    description: "Reach a 3 day streak",
    icon: "🔥",
    isUnlocked: (p) => (p?.streak ?? 0) >= 3,
  },
  {
    id: "xp-100",
    title: "Century",
    description: "Earn 100 XP",
    icon: "⚡",
    isUnlocked: (p) => (p?.xp ?? 0) >= 100,
  },
  {
    id: "gems-100",
    title: "Gem Collector",
    description: "Hold 100 gems",
    icon: "💎",
    isUnlocked: (p) => (p?.gems ?? 0) >= 100,
  },
];

export function AchievementCard({
  achievement,
  unlocked,
}: {
  achievement: Achievement;
  unlocked: boolean;
}) {
  return (
    <div
      className={`card-soft flex items-center gap-3 p-4 ${
        unlocked ? "" : "opacity-50"
      }`}
    >
      <span className="text-2xl">{achievement.icon}</span>
      <div>
        <p className="text-sm font-extrabold text-foreground">
          {achievement.title}
        </p>
        <p className="text-xs font-semibold text-muted-foreground">
          {achievement.description}
        </p>
      </div>
    </div>
  );
}