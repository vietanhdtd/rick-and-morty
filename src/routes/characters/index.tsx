import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { getPage, queryKeys } from "@/api/rick-and-morty";
import { CharacterCard } from "@/components/character-card";
import { QueryState } from "@/components/query-state";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const statusFilterOptions = ["all", "alive", "dead", "unknown"] as const;

const searchSchema = z.object({
  q: z.string().catch(""),
  status: z.enum(statusFilterOptions).catch("all"),
});

const SUGGESTIONS = [
  "Rick",
  "Morty",
  "Summer",
  "Beth",
  "Jerry",
  "Depp",
  "Ice",
  "Michael",
  "Squanchy",
  "Birdperson",
];

import { useDocumentTitle } from "@/hooks/use-document-title";

function CharactersPage() {
  useDocumentTitle("Characters");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(search.q);
  const debounced = useDebouncedValue(input);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value;
    setInput(q);
    void navigate({ search: (previous) => ({ ...previous, q }) });
  };
  const clearSearch = () => {
    setInput("");
    void navigate({ search: (previous) => ({ ...previous, q: "" }) });
  };
  const applySuggestion = (suggestion: string) => {
    setInput(suggestion);
    void navigate({ search: (previous) => ({ ...previous, q: suggestion }) });
  };

  const query = useInfiniteQuery({
    queryKey: queryKeys.page("character", {
      q: debounced,
      status: search.status,
    }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getPage("character", {
        page: pageParam,
        name: debounced,
        status: search.status === "all" ? undefined : search.status,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.info.next
        ? Number(new URL(lastPage.info.next).searchParams.get("page"))
        : undefined,
  });
  const characters = query.data?.pages.flatMap((page) => page.results) ?? [];
  const noResults =
    query.isError && (query.error as { status?: number }).status === 404;

  return (
    <section className="px-4 pt-12 sm:px-8 lg:px-16">
      <header className="mb-6 max-w-3xl">
        <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
          Characters / {characters.length || "—"} shown
        </p>
        <h2 className="mb-4 text-[clamp(2.6rem,4vw,5.7rem)]">
          Find a character.
        </h2>
        <p className="max-w-[52ch] text-content-secondary">
          Search people, creatures, and other oddities from across the series.
        </p>
      </header>
      <div className="mb-5 border border-border bg-surface-raised">
        <label className="flex items-center gap-3 p-4 text-signal relative">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">Search characters</span>
          <input
            type="search"
            value={input}
            onChange={handleSearchChange}
            name="character-search"
            autoComplete="off"
            placeholder="e.g. Rick Sanchez…"
            aria-label="Search characters"
            className="min-w-0 flex-1 border-0 bg-transparent text-xl tracking-[-.03em] text-content outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {input.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              className="grid size-8 place-items-center rounded-md text-content-muted hover:bg-signal-soft hover:text-signal"
              aria-label="Clear search"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto border-t border-border px-4 py-3 text-[0.6875rem] text-content-muted">
          <span className="font-semibold text-content whitespace-nowrap">
            Try:
          </span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              className="rounded-md border border-border px-2.5 py-1.5 whitespace-nowrap transition-colors hover:border-signal hover:bg-signal-soft hover:text-signal"
              onClick={() => applySuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto border-t border-border px-4 py-3 text-[0.6875rem] text-content-muted">
          <SlidersHorizontal size={15} aria-hidden="true" />
          <span id="status-filter-label">Status</span>
          {statusFilterOptions.map((status) => (
            <button
              type="button"
              key={status}
              className={`min-h-9 rounded-md border px-3 py-2 capitalize whitespace-nowrap ${search.status === status ? "border-signal bg-signal-soft text-signal" : "border-transparent"}`}
              aria-pressed={search.status === status}
              aria-label={`Status: ${status}`}
              onClick={() =>
                void navigate({
                  search: (previous) => ({ ...previous, status }),
                })
              }
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      {query.isPending ? (
        <QueryState kind="loading" label="character" />
      ) : noResults ? (
        <QueryState kind="empty" label="character" />
      ) : query.isError ? (
        <QueryState kind="error" onRetry={() => query.refetch()} />
      ) : (
        <>
          <div
            className="mb-4 flex items-center gap-2 text-[0.6875rem] text-content-muted"
            role="status"
            aria-live="polite"
          >
            <Filter size={14} aria-hidden="true" />{" "}
            {query.data?.pages[0].info.count} matching characters
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
              />
            ))}
          </div>
          {query.hasNextPage && (
            <button
              className="mx-auto mt-8 flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal bg-signal px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-signal-ink transition-[transform,background-color,border-color] duration-150 hover:scale-[1.015] hover:border-content hover:bg-content active:scale-[0.97] disabled:scale-100"
              type="button"
              onClick={() => query.fetchNextPage()}
              disabled={query.isFetchingNextPage}
              aria-busy={query.isFetchingNextPage}
            >
              {query.isFetchingNextPage
                ? "Loading more…"
                : "Load more characters"}
            </button>
          )}
        </>
      )}
    </section>
  );
}

export const Route = createFileRoute("/characters/")({
  component: CharactersPage,
  validateSearch: searchSchema,
});
