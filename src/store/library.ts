import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Character, Collection } from '@/types/rick-and-morty'

const serverStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

interface LibraryState {
  savedCharacters: Record<number, Character>
  collections: Collection[]
  toggleCharacter: (character: Character) => void
  createCollection: (name: string) => void
  deleteCollection: (id: string) => void
  toggleInCollection: (collectionId: string, characterId: number) => void
}

export const useLibraryStore = create<LibraryState>()(persist((set, get) => ({
  savedCharacters: {},
  collections: [],
  toggleCharacter: (character) => set((state) => {
    const savedCharacters = { ...state.savedCharacters }
    if (savedCharacters[character.id]) {
      delete savedCharacters[character.id]
      return { savedCharacters, collections: state.collections.map((collection) => ({ ...collection, characterIds: collection.characterIds.filter((id) => id !== character.id) })) }
    }
    savedCharacters[character.id] = character
    return { savedCharacters }
  }),
  createCollection: (name) => {
    const trimmed = name.trim()
    if (!trimmed || get().collections.some((collection) => collection.name.toLowerCase() === trimmed.toLowerCase())) return
    set((state) => ({ collections: [...state.collections, { id: crypto.randomUUID(), name: trimmed, characterIds: [], createdAt: new Date().toISOString() }] }))
  },
  deleteCollection: (id) => set((state) => ({ collections: state.collections.filter((collection) => collection.id !== id) })),
  toggleInCollection: (collectionId, characterId) => set((state) => ({
    collections: state.collections.map((collection) => collection.id !== collectionId ? collection : {
      ...collection,
      characterIds: collection.characterIds.includes(characterId)
        ? collection.characterIds.filter((id) => id !== characterId)
        : [...collection.characterIds, characterId],
    }),
  })),
}), {
  name: 'living-archive-library-v1',
  storage: createJSONStorage(() => typeof window === 'undefined' ? serverStorage : localStorage),
  partialize: (state) => ({ savedCharacters: state.savedCharacters, collections: state.collections }),
}))
