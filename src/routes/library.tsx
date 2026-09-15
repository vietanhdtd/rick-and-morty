import { Dialog } from "@base-ui/react/dialog";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArchiveRestore,
  ChevronRight,
  FolderOpen,
  Heart,
  Orbit,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import { CharacterCard } from "@/components/character-card";
import {
  CollectionDialog,
  RenameCollectionDialog,
} from "@/components/collection-dialog";
import { useLibraryStore } from "@/store/library";

const librarySearchSchema = z.object({ list: z.string().catch("all") });

function LibraryPage() {
  const { list } = Route.useSearch();
  const navigate = Route.useNavigate();
  const reducedMotion = useReducedMotion();
  const savedCharacters = useLibraryStore(
    useShallow((state) => Object.values(state.savedCharacters)),
  );
  const savedCharactersById = useLibraryStore((state) => state.savedCharacters);
  const collections = useLibraryStore((state) => state.collections);
  const deleteCollection = useLibraryStore((state) => state.deleteCollection);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "appearances">("name");
  const selectedCollection = collections.find(
    (collection) => collection.id === list,
  );
  const activeCharacters = selectedCollection
    ? selectedCollection.characterIds
        .map((id) => savedCharactersById[id])
        .filter((character): character is NonNullable<typeof character> =>
          Boolean(character),
        )
    : savedCharacters;
  const visibleCharacters = [...activeCharacters]
    .filter((character) =>
      character.name.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .sort((first, second) =>
      sort === "appearances"
        ? second.episode.length - first.episode.length ||
          first.name.localeCompare(second.name)
        : first.name.localeCompare(second.name),
    );

  function selectList(id = "all") {
    void navigate({ search: { list: id } });
  }
  function handleDelete(id: string) {
    deleteCollection(id);
    if (list === id) selectList();
  }

  return (
    <section className="library-page">
      <header className="library-page__header">
        <div>
          <p className="eyebrow">Personal character index</p>
          <h1>Library</h1>
          <p>
            Favorite characters, then build small lists for the threads you want
            to follow.
          </p>
        </div>
        <CollectionDialog
          onCreated={(collection) => selectList(collection.id)}
        />
      </header>
      <section className="library-stats" aria-label="Library totals">
        <span>
          <Heart size={15} /> {savedCharacters.length} favorites
        </span>
        <span>
          <Orbit size={15} /> {collections.length} lists
        </span>
      </section>

      <div className="library-workspace">
        <aside className="library-rail" aria-label="Library views">
          <p className="library-rail__label">Browse</p>
          <button
            className={`library-rail__item ${!selectedCollection ? "is-active" : ""}`}
            type="button"
            aria-current={!selectedCollection ? "page" : undefined}
            onClick={() => selectList()}
          >
            <span>
              <ArchiveRestore size={15} /> All favorites
            </span>
            <small>{savedCharacters.length}</small>
          </button>
          <div className="library-rail__lists">
            <p className="library-rail__label">Lists</p>
            {collections.map((collection) => (
              <button
                key={collection.id}
                className={`library-rail__item ${selectedCollection?.id === collection.id ? "is-active" : ""}`}
                type="button"
                aria-current={
                  selectedCollection?.id === collection.id ? "page" : undefined
                }
                onClick={() => selectList(collection.id)}
              >
                <span>
                  <FolderOpen size={15} /> {collection.name}
                </span>
                <small>{collection.characterIds.length}</small>
              </button>
            ))}
          </div>
          <CollectionDialog triggerLabel="Create list" />
        </aside>

        <main className="library-content" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedCollection?.id ?? "all"}
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, transform: "translateY(6px)" }
              }
              animate={{ opacity: 1, transform: "translateY(0)" }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, transform: "translateY(-4px)" }
              }
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              <header className="library-content__header">
                <div>
                  <p className="eyebrow">
                    {selectedCollection ? "List" : "All favorites"}
                  </p>
                  <h2>{selectedCollection?.name ?? "Every favorite"}</h2>
                  <p>
                    {activeCharacters.length}{" "}
                    {activeCharacters.length === 1 ? "character" : "characters"}
                  </p>
                </div>
                {selectedCollection ? (
                  <div className="library-content__actions">
                    <RenameCollectionDialog collection={selectedCollection} />
                    <Dialog.Root>
                      <Dialog.Trigger className="button button--quiet">
                        <Trash2 size={15} /> Delete
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Backdrop className="dialog-backdrop" />
                        <Dialog.Popup className="dialog-popup">
                          <span className="eyebrow">List settings</span>
                          <Dialog.Title>
                            Delete “{selectedCollection.name}”?
                          </Dialog.Title>
                          <Dialog.Description>
                            Its characters remain safely favorited in your
                            Library.
                          </Dialog.Description>
                          <div className="dialog-actions">
                            <Dialog.Close className="button button--quiet">
                              Keep list
                            </Dialog.Close>
                            <button
                              className="button button--danger"
                              type="button"
                              onClick={() =>
                                handleDelete(selectedCollection.id)
                              }
                            >
                              Delete list
                            </button>
                          </div>
                        </Dialog.Popup>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </div>
                ) : null}
              </header>
              {activeCharacters.length ? (
                <div className="library-controls">
                  <label>
                    <span>Search this view</span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Find a character"
                    />
                  </label>
                  <label>
                    <span>Sort by</span>
                    <select
                      value={sort}
                      onChange={(event) =>
                        setSort(event.target.value as "name" | "appearances")
                      }
                    >
                      <option value="name">Name</option>
                      <option value="appearances">Most appearances</option>
                    </select>
                  </label>
                </div>
              ) : null}
              {visibleCharacters.length ? (
                <div className="character-grid">
                  {visibleCharacters.map((character, index) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      index={index}
                      collectionId={selectedCollection?.id}
                    />
                  ))}
                </div>
              ) : activeCharacters.length ? (
                <div className="library-empty library-empty--compact">
                  <Heart />
                  <p>No matching characters.</p>
                  <span>Try a different name or clear the search.</span>
                </div>
              ) : (
                <div className="library-empty">
                  {selectedCollection ? <FolderOpen /> : <Heart />}
                  <p>
                    {selectedCollection
                      ? "This list is waiting for a cast."
                      : "No favorites yet."}
                  </p>
                  <span>
                    {selectedCollection
                      ? "Open a character and use Add to list to place them here."
                      : "Explore the character directory and build your first collection."}
                  </span>
                  <Link
                    className="button"
                    to="/characters"
                    search={{ q: "", status: "all" }}
                  >
                    {selectedCollection
                      ? "Add characters"
                      : "Browse characters"}{" "}
                    <ChevronRight size={15} />
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/library")({
  component: LibraryPage,
  validateSearch: librarySearchSchema,
});
