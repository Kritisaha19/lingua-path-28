import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--primary-shadow)] hover:brightness-105 active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--primary-shadow)]",
  secondary:
    "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_var(--secondary-shadow)] hover:brightness-105 active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--secondary-shadow)]",
  danger:
    "bg-destructive text-destructive-foreground shadow-[0_4px_0_0_oklch(0.5_0.2_22)] hover:brightness-105 active:translate-y-[3px]",
  ghost:
    "bg-transparent text-muted-foreground border-2 border-border hover:bg-muted",
};

export function DuoButton({
  variant = "primary",
  full,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={cn(
        "btn-3d px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
        variants[variant],
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}