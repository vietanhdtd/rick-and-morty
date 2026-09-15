import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Character, Collection } from "@/types/rick-and-morty";

export type CollectionCreateResult =
  | { status: "created"; collection: Collection }
  | { status: "duplicate" }
  | { status: "empty" };

export type CollectionResult =
  | { status: "renamed"; collection: Collection }
  | { status: "duplicate" }
  | { status: "empty" }
  | { status: "missing" };

const serverStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

interface LibraryState {
  savedCharacters: Record<number, Character>;
  collections: Collection[];
  toggleCharacter: (character: Character) => void;
  saveCharacter: (character: Character) => void;
  removeCharacter: (characterId: number) => number;
  createCollection: (name: string, character?: Character) => CollectionCreateResult;
  renameCollection: (id: string, name: string) => CollectionResult;
  deleteCollection: (id: string) => void;
  addCharacterToCollection: (collectionId: string, character: Character) => void;
  removeCharacterFromCollection: (collectionId: string, characterId: number) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      savedCharacters: {},
      collections: [],
      saveCharacter: (character) =>
        set((state) => ({
          savedCharacters: {
            ...state.savedCharacters,
            [character.id]: character,
          },
        })),
      removeCharacter: (characterId) => {
        const membershipCount = get().collections.filter((collection) =>
          collection.characterIds.includes(characterId),
        ).length;
        set((state) => {
          const savedCharacters = { ...state.savedCharacters };
          delete savedCharacters[characterId];
          return {
            savedCharacters,
            collections: state.collections.map((collection) => ({
              ...collection,
              characterIds: collection.characterIds.filter(
                (id) => id !== characterId,
              ),
            })),
          };
        });
        return membershipCount;
      },
      toggleCharacter: (character) => {
        if (get().savedCharacters[character.id]) {
          get().removeCharacter(character.id);
          return;
        }
        get().saveCharacter(character);
      },
      createCollection: (name, character) => {
        const trimmed = name.trim();
        if (!trimmed) return { status: "empty" };
        if (
          get().collections.some(
            (collection) =>
              collection.name.toLowerCase() === trimmed.toLowerCase(),
          )
        )
          return { status: "duplicate" };
        const collection: Collection = {
          id: crypto.randomUUID(),
          name: trimmed,
          characterIds: character ? [character.id] : [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          savedCharacters: character
            ? { ...state.savedCharacters, [character.id]: character }
            : state.savedCharacters,
          collections: [
            ...state.collections,
            collection,
          ],
        }));
        return { status: "created", collection };
      },
      renameCollection: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) return { status: "empty" };
        const existing = get().collections.find((collection) => collection.id === id);
        if (!existing) return { status: "missing" };
        if (
          get().collections.some(
            (collection) =>
              collection.id !== id &&
              collection.name.toLowerCase() === trimmed.toLowerCase(),
          )
        )
          return { status: "duplicate" };
        const collection = { ...existing, name: trimmed };
        set((state) => ({
          collections: state.collections.map((item) =>
            item.id === id ? collection : item,
          ),
        }));
        return { status: "renamed", collection };
      },
      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter(
            (collection) => collection.id !== id,
          ),
        })),
      addCharacterToCollection: (collectionId, character) =>
        set((state) => ({
          savedCharacters: {
            ...state.savedCharacters,
            [character.id]: character,
          },
          collections: state.collections.map((collection) =>
            collection.id !== collectionId
              ? collection
              : {
                  ...collection,
                  characterIds: collection.characterIds.includes(character.id)
                    ? collection.characterIds
                    : [...collection.characterIds, character.id],
                },
          ),
        })),
      removeCharacterFromCollection: (collectionId, characterId) =>
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id !== collectionId
              ? collection
              : {
                  ...collection,
                  characterIds: collection.characterIds.filter(
                    (id) => id !== characterId,
                  ),
                },
          ),
        })),
    }),
    {
      name: "living-archive-library-v1",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? serverStorage : localStorage,
      ),
      partialize: (state) => ({
        savedCharacters: state.savedCharacters,
        collections: state.collections,
      }),
    },
  ),
);
