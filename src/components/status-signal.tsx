import type { Character } from "@/types/rick-and-morty";

export function StatusSignal({ status }: Pick<Character, "status">) {
  return (
    <span className={`status status--${status.toLowerCase()}`}>
      <i aria-hidden="true" />
      {status}
    </span>
  );
}
