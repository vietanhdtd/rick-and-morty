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
      <div className="flex min-h-[calc(100vh-200px)] p-5 sm:p-12">
        <div
          className="w-full flex justify-center items-center gap-2 border border-dashed border-border-strong text-center text-[0.875rem] text-content-muted"
          role="status"
          aria-live="polite"
        >
          <span
            className="size-7 animate-spin rounded-full border-2 border-signal-soft border-t-signal"
            aria-hidden="true"
          />
          Loading {label}…
        </div>
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
    <div className="flex min-h-[calc(100vh-200px)] items-start px-5 pt-8 pb-28 sm:items-center sm:p-12">
      <div
        className="grid min-h-56 w-full grid-cols-[auto_minmax(0,1fr)] content-center gap-x-4 gap-y-3 border border-alert border-l-[3px] bg-alert-soft p-5 text-left text-content-secondary sm:p-8"
        role="alert"
      >
        <div
          className="grid size-10 place-items-center self-start border border-alert bg-surface text-alert"
          aria-hidden="true"
        >
          <TriangleAlert size={20} />
        </div>
        <div>
          <p className="mb-2 text-[0.625rem] font-semibold tracking-[0.08em] text-alert uppercase">
            Archive signal interrupted
          </p>
          <h2 className="mb-2 text-[clamp(1.25rem,3vw,1.75rem)]">
            This record is out of reach.
          </h2>
          <p className="mb-0 max-w-[52ch] text-[0.8125rem] text-content-secondary">
            We couldn’t load the requested {label}. Check your connection, then
            try again.
          </p>
        </div>
        {onRetry && (
          <button
            className="col-start-2 inline-flex min-h-10 w-fit items-center gap-2 border border-alert bg-alert px-4 py-2 text-[0.8125rem] font-semibold text-surface transition-[transform,background-color,border-color] duration-150 ease-out hover:scale-[1.015] hover:border-content hover:bg-content active:scale-[0.97]"
            type="button"
            onClick={onRetry}
          >
            <RotateCw size={15} aria-hidden="true" /> Try again
          </button>
        )}
      </div>
    </div>
  );
}
