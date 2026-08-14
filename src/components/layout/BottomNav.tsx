import { Link } from "@tanstack/react-router";
import { Home, Settings, Trophy, User } from "lucide-react";

const items = [
  { to: "/", label: "Learn", Icon: Home },
  { to: "/leaderboard", label: "Ranks", Icon: Trophy },
  { to: "/profile", label: "Profile", Icon: User },
  { to: "/settings", label: "Settings", Icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 border-t-2 border-border bg-card md:hidden">
      <ul className="mx-auto flex max-w-lg">
        {items.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 py-2 text-[11px] font-bold text-muted-foreground [&.active]:text-primary"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}