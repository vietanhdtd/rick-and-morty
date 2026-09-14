import { expect, test } from 'bun:test'
import { idFromApiUrl } from './rick-and-morty'

test('extracts a resource id from an API URL', () => {
  expect(idFromApiUrl('https://rickandmortyapi.com/api/location/20')).toBe(20)
  expect(idFromApiUrl('not-a-resource')).toBeNull()
})
