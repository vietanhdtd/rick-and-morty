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
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useLibraryStore } from "@/store/library";

const librarySearchSchema = z.object({ list: z.string().catch("all") });

function LibraryPage() {
  useDocumentTitle("Library");
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
    <section className="px-4 pt-12 sm:px-8 lg:px-16">
      <header className="flex flex-col items-start justify-between gap-5 border-b border-border pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
            Personal character index
          </p>
          <h1 className="my-2 text-[clamp(2.4rem,4vw,4.5rem)] leading-[.92]">
            Library
          </h1>
          <p className="max-w-[54ch] text-[0.8125rem] text-content-secondary">
            Favorite characters, then build small lists for the threads you want
            to follow.
          </p>
        </div>
        <CollectionDialog
          onCreated={(collection) => selectList(collection.id)}
        />
      </header>
      <section
        className="my-4 flex flex-wrap gap-2"
        aria-label="Library totals"
      >
        <span className="flex items-center gap-2 border border-border p-3 text-[0.6875rem] text-content-muted">
          <Heart size={15} aria-hidden="true" /> {savedCharacters.length}{" "}
          favorites
        </span>
        <span className="flex items-center gap-2 border border-border p-3 text-[0.6875rem] text-content-muted">
          <Orbit size={15} aria-hidden="true" /> {collections.length} lists
        </span>
      </section>

      <div className="grid grid-cols-1 border-t border-border md:grid-cols-[minmax(12rem,15rem)_minmax(0,1fr)]">
        <aside
          className="min-w-0 border-b border-border py-4 pr-3 md:border-r md:border-b-0"
          aria-label="Library views"
        >
          <p className="mx-3 my-2 text-[0.625rem] tracking-[.08em] text-content-muted uppercase">
            Browse
          </p>
          <button
            className={`flex min-h-10 w-full items-center justify-between gap-2 border px-3 py-2 text-left text-[0.75rem] ${!selectedCollection ? "border-signal bg-signal-soft text-signal" : "border-transparent bg-transparent text-content-secondary"}`}
            type="button"
            aria-current={!selectedCollection ? "page" : undefined}
            onClick={() => selectList()}
          >
            <span className="inline-flex min-w-0 items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <ArchiveRestore size={15} aria-hidden="true" /> All favorites
            </span>
            <small className="text-[0.625rem] text-content-muted">
              {savedCharacters.length}
            </small>
          </button>
          <div className="mt-4 border-t border-border pt-2">
            <p className="mx-3 my-2 text-[0.625rem] tracking-[.08em] text-content-muted uppercase">
              Lists
            </p>
            {collections.map((collection) => (
              <button
                key={collection.id}
                className={`flex min-h-10 w-full items-center justify-between gap-2 border px-3 py-2 text-left text-[0.75rem] ${selectedCollection?.id === collection.id ? "border-signal bg-signal-soft text-signal" : "border-transparent bg-transparent text-content-secondary"}`}
                type="button"
                aria-current={
                  selectedCollection?.id === collection.id ? "page" : undefined
                }
                aria-label={`Select list: ${collection.name}`}
                onClick={() => selectList(collection.id)}
              >
                <span className="inline-flex min-w-0 items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <FolderOpen size={15} aria-hidden="true" /> {collection.name}
                </span>
                <small className="text-[0.625rem] text-content-muted">
                  {collection.characterIds.length}
                </small>
              </button>
            ))}
          </div>
          <div className="mx-3 mt-4">
            <CollectionDialog triggerLabel="Create list" />
          </div>
        </aside>

        <section
          className="min-w-0 py-5 md:pl-6 md:pb-8"
          aria-label="Library view"
          aria-live="polite"
        >
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
              <header className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
                    {selectedCollection ? "List" : "All favorites"}
                  </p>
                  <h2 className="my-2 text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[.95]">
                    {selectedCollection?.name ?? "Every favorite"}
                  </h2>
                  <p className="text-[0.6875rem] text-content-muted">
                    {activeCharacters.length}{" "}
                    {activeCharacters.length === 1 ? "character" : "characters"}
                  </p>
                </div>
                {selectedCollection ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    <RenameCollectionDialog collection={selectedCollection} />
                    <Dialog.Root>
                      <Dialog.Trigger
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold text-content-secondary"
                        aria-label={`Delete list: ${selectedCollection.name}`}
                      >
                        <Trash2 size={15} aria-hidden="true" /> Delete
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Backdrop className="fixed inset-0 z-50 bg-canvas-dark/72 opacity-100 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
                        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[51] w-[26rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 scale-100 border border-border-strong bg-surface p-6 opacity-100 shadow-lg transition-[opacity,transform] duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
                          <span className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
                            List settings
                          </span>
                          <Dialog.Title className="mb-3 text-3xl">
                            Delete “{selectedCollection.name}”?
                          </Dialog.Title>
                          <Dialog.Description className="text-content-muted">
                            Its characters remain safely favorited in your
                            Library.
                          </Dialog.Description>
                          <div className="flex justify-end gap-2">
                            <Dialog.Close className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold text-content-secondary">
                              Keep list
                            </Dialog.Close>
                            <button
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-alert bg-alert px-4 py-2.5 text-[0.8125rem] font-semibold text-white"
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
                <div className="mb-4 flex flex-wrap items-end gap-3 border-y border-border py-3">
                  <label className="grid min-w-[min(100%,14rem)] flex-1 gap-1">
                    <span className="text-[0.625rem] tracking-[.06em] text-content-muted uppercase">
                      Search this view
                    </span>
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Find a character"
                      aria-label="Search within this view"
                      className="min-h-10 border border-border-strong bg-surface-raised p-2 text-[0.75rem] text-content"
                    />
                  </label>
                  <label className="grid min-w-[min(100%,14rem)] gap-1">
                    <span className="text-[0.625rem] tracking-[.06em] text-content-muted uppercase">
                      Sort by
                    </span>
                    <select
                      value={sort}
                      onChange={(event) =>
                        setSort(event.target.value as "name" | "appearances")
                      }
                      aria-label="Sort characters"
                      className="min-h-10 border border-border-strong bg-surface-raised p-2 text-[0.75rem] text-content"
                    >
                      <option value="name">Name</option>
                      <option value="appearances">Most appearances</option>
                    </select>
                  </label>
                </div>
              ) : null}
              {visibleCharacters.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                <div
                  className="flex min-h-44 flex-col items-center justify-center gap-2 border border-dashed border-border-strong p-5 text-center text-[0.8125rem] text-content-muted"
                  role="status"
                  aria-live="polite"
                >
                  <Heart aria-hidden="true" />
                  <p>No matching characters.</p>
                  <span>Try a different name or clear the search.</span>
                </div>
              ) : (
                <div
                  className="flex min-h-76 flex-col items-center justify-center gap-2 border border-dashed border-border-strong p-5 text-center text-[0.8125rem] text-content-muted"
                  role="status"
                  aria-live="polite"
                >
                  {selectedCollection ? (
                    <FolderOpen aria-hidden="true" />
                  ) : (
                    <Heart aria-hidden="true" />
                  )}
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
                    className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal bg-signal px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-signal-ink"
                    to="/characters"
                    search={{ q: "", status: "all" }}
                  >
                    {selectedCollection
                      ? "Add characters"
                      : "Browse characters"}{" "}
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/library")({
  component: LibraryPage,
  validateSearch: librarySearchSchema,
});
