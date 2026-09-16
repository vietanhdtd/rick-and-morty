import { RotateCw, TriangleAlert } from "lucide-react";

export function QueryState({
  kind,
  onRetry,
  label = "result",
}: {
  kind: "loading" | "error" | "empty";
  onRetry?: () => void;
  label?: string;
}) {
  if (kind === "loading")
    return (
      <div
        className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center gap-2 border border-dashed border-border-strong p-5 text-center text-[0.875rem] text-content-muted"
        role="status"
        aria-live="polite"
      >
        <span
          className="size-7 animate-spin rounded-full border-2 border-signal-soft border-t-signal"
          aria-hidden="true"
        />
        Loading {label}…
      </div>
    );
  if (kind === "empty")
    return (
      <div
        className="flex min-h-44 flex-col items-center justify-center gap-2 border border-dashed border-border-strong p-5 text-center text-[0.875rem] text-content-muted"
        role="status"
        aria-live="polite"
      >
        <p>No {label} match your search.</p>
        <span>Try a different name or filter.</span>
      </div>
    );
  return (
    <div
      className="flex min-h-44 flex-col items-center justify-center gap-2 border border-dashed border-alert p-5 text-center text-[0.875rem] text-alert"
      role="alert"
    >
      <TriangleAlert aria-hidden="true" />
      <p>We could not load this part of the guide.</p>
      {onRetry && (
        <button
          className="inline-flex min-h-10 items-center gap-2 border border-current px-3 py-2"
          type="button"
          onClick={onRetry}
        >
          <RotateCw size={15} aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  );
}
