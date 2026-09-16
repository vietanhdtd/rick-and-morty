import type { Character } from "@/types/rick-and-morty";

const STATUS_STYLES = {
  Alive: "bg-status-alive/15 text-status-alive border-status-alive/30",
  Dead: "bg-status-dead/15 text-status-dead border-status-dead/30",
  unknown: "bg-status-unknown/15 text-status-unknown border-status-unknown/30",
} as const;

const DOT_STYLES = {
  Alive: "bg-status-alive shadow-[0_0_8px_var(--color-status-alive)]",
  Dead: "bg-status-dead shadow-[0_0_8px_var(--color-status-dead)]",
  unknown: "bg-status-unknown shadow-[0_0_8px_var(--color-status-unknown)]",
} as const;

export function StatusSignal({ status }: Pick<Character, "status">) {
  const containerStyle = STATUS_STYLES[status] || STATUS_STYLES.unknown;
  const dotStyle = DOT_STYLES[status] || DOT_STYLES.unknown;

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 border px-2.5 py-1 text-[0.625rem] font-semibold leading-none tracking-[0.04em] uppercase ${containerStyle}`}
    >
      <i aria-hidden="true" className={`size-1.5 rounded-full ${dotStyle}`} />
      <span className="translate-y-px">{status}</span>
    </span>
  );
}
