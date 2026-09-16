import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { getPage, queryKeys } from "@/api/rick-and-morty";
import { QueryState } from "@/components/query-state";

import { useDocumentTitle } from "@/hooks/use-document-title";

function LocationsPage() {
  useDocumentTitle("Places");
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: queryKeys.page("location", { page }),
    queryFn: () => getPage("location", { page }),
  });

  if (query.isPending) return <QueryState kind="loading" label="location" />;
  if (query.isError || !query.data)
    return <QueryState kind="error" onRetry={() => query.refetch()} />;

  return (
    <section className="px-4 pt-12 sm:px-8 lg:px-16">
      <header className="mb-6 max-w-3xl">
        <p className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">
          Places / {query.data.info.count} total
        </p>
        <h1 className="mb-4 text-[clamp(2.6rem,4vw,5.7rem)]">
          Explore the places.
        </h1>
        <p className="max-w-[52ch] text-content-secondary">
          Planets, citadels, alternate dimensions, and places worth a closer
          look.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.results.map((location) => (
          <Link
            key={location.id}
            to="/locations/$locationId"
            params={{ locationId: String(location.id) }}
            aria-label={`View ${location.name}`}
            className="hover:shadow-surface-raised group relative flex min-h-50 flex-col border border-border bg-surface-raised p-5 transition-shadow hover:shadow-lg"
          >
            {/* <article
              className="flex min-h-50 flex-col border border-border bg-surface-raised p-5"

              style={{ "--i": index } as React.CSSProperties}
            > */}
            <div className="flex items-center gap-2">
              <div>
                <MapPin aria-hidden="true" />
              </div>
              <span className="flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] uppercase">
                #{String(location.id).padStart(3, "0")} /{" "}
                {location.type || "Unknown"}
              </span>
            </div>
            <h2 className="mt-4 mb-2 text-2xl text-signal">{location.name}</h2>
            <p className="text-[0.75rem] text-content-muted">
              {location.dimension}
            </p>
            <footer className="mt-auto flex items-center justify-between pt-3 text-[0.625rem] text-content-muted">
              <span>{location.residents.length} residents</span>
              <Link
                to="/locations/$locationId"
                params={{ locationId: String(location.id) }}
                aria-label={`View ${location.name}`}
              >
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </footer>
            {/* </article> */}
          </Link>
        ))}
      </div>
      <nav
        className="mt-8 flex items-center justify-center gap-4 text-[0.6875rem] text-content-muted"
        aria-label="Locations pagination"
      >
        <button
          type="button"
          className="min-h-10 rounded-md border border-border-strong px-3 py-2 text-content-secondary"
          disabled={!query.data.info.prev}
          aria-label="Previous page"
          onClick={() => setPage((value) => value - 1)}
        >
          Previous
        </button>
        <span aria-current="page" role="status" aria-live="polite">
          Page {page} of {query.data.info.pages}
        </span>
        <button
          type="button"
          className="min-h-10 rounded-md border border-border-strong px-3 py-2 text-content-secondary"
          disabled={!query.data.info.next}
          aria-label="Next page"
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </button>
      </nav>
    </section>
  );
}

export const Route = createFileRoute("/locations/")({
  component: LocationsPage,
});
