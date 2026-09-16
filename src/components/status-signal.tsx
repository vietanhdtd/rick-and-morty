import type { Character } from '@/types/rick-and-morty'

export function StatusSignal({ status }: Pick<Character, 'status'>) {
  return (
    <span className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.04em] uppercase">
      <i
        aria-hidden="true"
        className={
          status === 'Alive'
            ? 'size-1.5 rounded-full bg-status-alive'
            : status === 'Dead'
              ? 'size-1.5 rounded-full bg-status-dead'
              : 'size-1.5 rounded-full bg-status-unknown'
        }
      />
      {status}
    </span>
  )
}
