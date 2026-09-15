import { getPage, queryKeys } from "@/api/rick-and-morty";
import { CharacterCard } from "@/components/character-card";
import { QueryState } from "@/components/query-state";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().catch(""),
  status: z.enum(["all", "Alive", "Dead", "unknown"]).catch("all"),
});

function CharactersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(search.q);
  const debounced = useDebouncedValue(input);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value;
    setInput(q);
    void navigate({ search: (previous) => ({ ...previous, q }) });
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
    <section className="archive-page">
      <header className="page-intro">
        <p className="eyebrow">
          Characters / {characters.length || "—"} shown
        </p>
        <h1>
          Find a character.
        </h1>
        <p>
          Search people, creatures, and other oddities from across the series.
        </p>
      </header>
      <div className="search-panel">
        <label>
          <Search size={19} />
          <span className="sr-only">Search characters</span>
          <input
            value={input}
            onChange={handleSearchChange}
            name="character-search"
            autoComplete="off"
            placeholder="e.g. Rick Sanchez…"
          />
        </label>
        <div className="filter-row">
          <SlidersHorizontal size={15} />
          <span>Status</span>
          {(["all", "Alive", "Dead", "unknown"] as const).map((status) => (
            <button
              type="button"
              key={status}
              className={search.status === status ? "is-selected" : ""}
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
          <div className="archive-meta">
            <Filter size={14} /> {query.data?.pages[0].info.count} matching
            characters
          </div>
          <div className="character-grid">
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
              className="button button--load"
              type="button"
              onClick={() => query.fetchNextPage()}
              disabled={query.isFetchingNextPage}
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
