export type ResourceKind = 'character' | 'location' | 'episode'

export interface ApiReference {
  name: string
  url: string
}

export interface Character {
  id: number
  name: string
  status: 'Alive' | 'Dead' | 'unknown'
  species: string
  type: string
  gender: string
  origin: ApiReference
  location: ApiReference
  image: string
  episode: string[]
  url: string
  created: string
}

export interface Location {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: string
}

export interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

export interface PageInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface ApiPage<T> {
  info: PageInfo
  results: T[]
}

export interface Collection {
  id: string
  name: string
  characterIds: number[]
  createdAt: string
}
