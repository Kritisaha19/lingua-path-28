import { useEffect, useState } from "react";
import { Bell, Globe, Info, Palette, User as UserIcon, Volume2 } from "lucide-react";
import type { User } from "@/lib/types";
import { API_URL } from "@/lib/api";

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-soft mb-4 p-5">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-extrabold text-foreground">{label}</p>
        <p className="text-xs font-semibold text-muted-foreground">
          {description}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-card transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

const STORAGE_KEY = "lingolumo:settings";

type Prefs = { notifications: boolean; sound: boolean; largeText: boolean };
const DEFAULT_PREFS: Prefs = {
  notifications: true,
  sound: true,
  largeText: false,
};

export function Settings({ user }: { user: User | null }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  // Client-only: read after mount so server HTML stays deterministic.
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setPrefs({ ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) });
    } catch {
      /* ignore malformed prefs */
    }
  }, []);

  function update(patch: Partial<Prefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-extrabold text-foreground">Settings</h1>

      <Section icon={<UserIcon className="h-4 w-4" />} title="Profile">
        <p className="text-sm font-extrabold text-foreground">
          {user?.name ?? "—"}
        </p>
        <p className="text-xs font-semibold text-muted-foreground">
          Signed in as the default learner for this assignment.
        </p>
      </Section>

      <Section icon={<Globe className="h-4 w-4" />} title="Learning language">
        <p className="text-sm font-extrabold text-foreground">
          {user?.learningLanguage ?? "—"}
        </p>
        <p className="text-xs font-semibold text-muted-foreground">
          The seeded course currently offers one language.
        </p>
      </Section>

      <Section icon={<Bell className="h-4 w-4" />} title="Notifications">
        <Toggle
          label="Practice reminders"
          description="A nudge when your streak is at risk"
          checked={prefs.notifications}
          onChange={(v) => update({ notifications: v })}
        />
      </Section>

      <Section icon={<Volume2 className="h-4 w-4" />} title="Sound">
        <Toggle
          label="Sound effects"
          description="Play feedback sounds during lessons"
          checked={prefs.sound}
          onChange={(v) => update({ sound: v })}
        />
      </Section>

      <Section icon={<Palette className="h-4 w-4" />} title="Appearance">
        <Toggle
          label="Larger text"
          description="Increase text size across lessons"
          checked={prefs.largeText}
          onChange={(v) => update({ largeText: v })}
        />
      </Section>

      <Section icon={<Info className="h-4 w-4" />} title="About">
        <p className="text-xs font-semibold text-muted-foreground">
          Lingolumo — a language-learning client for the FastAPI + SQLite
          backend.
        </p>
        <p className="mt-1 break-all text-xs font-semibold text-muted-foreground">
          API endpoint: {API_URL}
        </p>
      </Section>
    </div>
  );
}