import { DuoButton } from "./duo-button";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  detail,
  onRetry,
}: {
  message: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card-soft mx-auto my-10 max-w-md p-8 text-center">
      <div className="text-4xl">😵</div>
      <h2 className="mt-3 text-lg font-extrabold text-foreground">{message}</h2>
      {detail ? (
        <p className="mt-2 break-words text-sm text-muted-foreground">{detail}</p>
      ) : null}
      {onRetry ? (
        <div className="mt-6">
          <DuoButton onClick={onRetry}>Retry</DuoButton>
        </div>
      ) : null}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card-soft p-8 text-center text-sm font-semibold text-muted-foreground">
      {message}
    </div>
  );
}