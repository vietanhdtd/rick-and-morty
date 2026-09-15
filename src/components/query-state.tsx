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
      <div className="query-state query-state--loading" aria-live="polite">
        <span className="orbital-loader" />
        Loading {label}…
      </div>
    );
  if (kind === "empty")
    return (
      <div className="query-state">
        <p>No {label} match your search.</p>
        <span>Try a different name or filter.</span>
      </div>
    );
  return (
    <div className="query-state query-state--error" role="alert">
      <TriangleAlert aria-hidden="true" />
      <p>We could not load this part of the guide.</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          <RotateCw size={15} /> Try again
        </button>
      )}
    </div>
  );
}
