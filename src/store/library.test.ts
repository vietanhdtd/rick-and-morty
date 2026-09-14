import { beforeEach, expect, test } from 'bun:test'
import { useLibraryStore } from './library'
import type { Character } from '@/types/rick-and-morty'

const character: Character = { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', type: '', gender: 'Male', origin: { name: 'Earth', url: '' }, location: { name: 'Earth', url: '' }, image: 'https://example.com/rick.jpg', episode: [], url: 'https://example.com/1', created: '' }

beforeEach(() => useLibraryStore.setState({ savedCharacters: {}, collections: [] }))

test('removing a saved character also removes every collection reference', () => {
  const store = useLibraryStore.getState()
  store.toggleCharacter(character)
  store.createCollection('C-137')
  const collection = useLibraryStore.getState().collections[0]
  useLibraryStore.getState().toggleInCollection(collection.id, character.id)
  useLibraryStore.getState().toggleCharacter(character)
  expect(useLibraryStore.getState().savedCharacters[character.id]).toBeUndefined()
  expect(useLibraryStore.getState().collections[0].characterIds).toEqual([])
})

test('deleting a collection keeps its saved character', () => {
  const store = useLibraryStore.getState()
  store.toggleCharacter(character)
  store.createCollection('Portal people')
  const collection = useLibraryStore.getState().collections[0]
  useLibraryStore.getState().deleteCollection(collection.id)
  expect(useLibraryStore.getState().savedCharacters[character.id]).toEqual(character)
})
