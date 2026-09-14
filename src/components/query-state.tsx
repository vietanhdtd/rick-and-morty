import { RotateCw, TriangleAlert } from 'lucide-react'

export function QueryState({ kind, onRetry, label = 'signal' }: { kind: 'loading' | 'error' | 'empty'; onRetry?: () => void; label?: string }) {
  if (kind === 'loading') return <div className="query-state query-state--loading" aria-live="polite"><span className="orbital-loader" />Scanning {label} frequencies…</div>
  if (kind === 'empty') return <div className="query-state"><p>No {label} signals match this frequency.</p><span>Try broadening the transmission.</span></div>
  return <div className="query-state query-state--error" role="alert"><TriangleAlert aria-hidden="true" /><p>The archive signal dropped.</p>{onRetry && <button type="button" onClick={onRetry}><RotateCw size={15} /> Reconnect</button>}</div>
}
