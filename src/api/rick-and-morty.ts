import { z } from 'zod'
import type { ApiPage, Character, Episode, Location, ResourceKind } from '@/types/rick-and-morty'

const API_URL = 'https://rickandmortyapi.com/api'

const referenceSchema = z.object({ name: z.string(), url: z.string() })
const pageInfoSchema = z.object({ count: z.number(), pages: z.number(), next: z.string().nullable(), prev: z.string().nullable() })
const characterSchema = z.object({
  id: z.number(), name: z.string(), status: z.enum(['Alive', 'Dead', 'unknown']), species: z.string(), type: z.string(), gender: z.string(),
  origin: referenceSchema, location: referenceSchema, image: z.string().url(), episode: z.array(z.string().url()), url: z.string().url(), created: z.string(),
})
const locationSchema = z.object({ id: z.number(), name: z.string(), type: z.string(), dimension: z.string(), residents: z.array(z.string().url()), url: z.string().url(), created: z.string() })
const episodeSchema = z.object({ id: z.number(), name: z.string(), air_date: z.string(), episode: z.string(), characters: z.array(z.string().url()), url: z.string().url(), created: z.string() })

const schemas = { character: characterSchema, location: locationSchema, episode: episodeSchema } as const

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message) }
}

async function request<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) {
    if (response.status === 404) throw new ApiError('No signals found for that frequency.', 404)
    throw new ApiError('The archive connection is unstable. Try again.', response.status)
  }
  return schema.parse(await response.json())
}

export function getPage(resource: 'character', filters?: Record<string, string | number | undefined>): Promise<ApiPage<Character>>
export function getPage(resource: 'location', filters?: Record<string, string | number | undefined>): Promise<ApiPage<Location>>
export function getPage(resource: 'episode', filters?: Record<string, string | number | undefined>): Promise<ApiPage<Episode>>
export function getPage(resource: ResourceKind, filters: Record<string, string | number | undefined> = {}): Promise<ApiPage<Character> | ApiPage<Location> | ApiPage<Episode>> {
  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== '') query.set(key, String(value)) })
  const suffix = query.size ? `?${query.toString()}` : ''
  return request(`/${resource}${suffix}`, z.object({ info: pageInfoSchema, results: z.array(schemas[resource]) }) as z.ZodTypeAny) as Promise<ApiPage<Character> | ApiPage<Location> | ApiPage<Episode>>
}

export function getEntity(resource: 'character', id: string | number): Promise<Character>
export function getEntity(resource: 'location', id: string | number): Promise<Location>
export function getEntity(resource: 'episode', id: string | number): Promise<Episode>
export function getEntity(resource: ResourceKind, id: string | number): Promise<Character | Location | Episode> {
  return request(`/${resource}/${id}`, schemas[resource] as z.ZodTypeAny) as Promise<Character | Location | Episode>
}

export function getCharacters(ids: number[]) {
  if (!ids.length) return Promise.resolve([] as Character[])
  return request(`/character/${ids.join(',')}`, z.union([characterSchema, z.array(characterSchema)]))
    .then((result) => Array.isArray(result) ? result : [result])
}

export function getRandomSignal(resource: 'character'): Promise<Character>
export function getRandomSignal(resource: 'location'): Promise<Location>
export function getRandomSignal(resource: 'episode'): Promise<Episode>
export async function getRandomSignal(resource: ResourceKind): Promise<Character | Location | Episode> {
  const first = resource === 'character' ? await getPage('character', { page: 1 }) : resource === 'location' ? await getPage('location', { page: 1 }) : await getPage('episode', { page: 1 })
  const page = Math.floor(Math.random() * first.info.pages) + 1
  const source = page === 1 ? first : resource === 'character' ? await getPage('character', { page }) : resource === 'location' ? await getPage('location', { page }) : await getPage('episode', { page })
  return source.results[Math.floor(Math.random() * source.results.length)]
}

export function idFromApiUrl(url: string) {
  const match = url.match(/\/(\d+)$/)
  return match ? Number(match[1]) : null
}

export const queryKeys = {
  entity: <T extends ResourceKind>(resource: T, id: string | number) => [resource, id] as const,
  page: <T extends ResourceKind>(resource: T, filters: Record<string, unknown>) => [resource, 'page', filters] as const,
  signal: (resource: ResourceKind, refresh: number) => ['signal', resource, refresh] as const,
}
