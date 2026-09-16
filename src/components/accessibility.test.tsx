import { expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { QueryState } from './query-state'
import { StatusSignal } from './status-signal'

test('StatusSignal renders accessible text alongside hidden visual indicator', () => {
  const html = renderToString(<StatusSignal status="Alive" />)
  expect(html).toContain('Alive')
  expect(html).toContain('aria-hidden="true"')
})

test('QueryState error renders role="alert"', () => {
  const html = renderToString(<QueryState kind="error" />)
  expect(html).toContain('role="alert"')
})

test('QueryState loading renders role="status" and aria-live="polite"', () => {
  const html = renderToString(<QueryState kind="loading" label="characters" />)
  expect(html).toContain('role="status"')
  expect(html).toContain('aria-live="polite"')
})

test('QueryState empty renders role="status" and aria-live="polite"', () => {
  const html = renderToString(<QueryState kind="empty" label="characters" />)
  expect(html).toContain('role="status"')
  expect(html).toContain('aria-live="polite"')
})
