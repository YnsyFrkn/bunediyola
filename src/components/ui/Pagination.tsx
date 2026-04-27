import Link from "next/link";

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemLabel: string;
  query?: Record<string, string | number | undefined>;
  showWhenSinglePage?: boolean;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getPageHref({
  basePath,
  page,
  query,
}: {
  basePath: string;
  page: number;
  query?: Record<string, string | number | undefined>;
}) {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  totalCount,
  itemLabel,
  query,
  showWhenSinglePage = false,
}: PaginationProps) {
  if (totalCount === 0 || (!showWhenSinglePage && totalPages <= 1)) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="flex flex-col gap-3 rounded-[28px] border border-[#f1e6dd] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm font-semibold text-[#4b5563]">
        {totalCount} {itemLabel} icinde {currentPage}. sayfa
      </p>

      <div className="flex flex-wrap gap-2">
        {currentPage > 1 ? (
          <Link
            href={getPageHref({ basePath, page: currentPage - 1, query })}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white px-4 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#9a3412]"
          >
            Onceki
          </Link>
        ) : null}

        {visiblePages[0] > 1 ? (
          <>
            <Link
              href={getPageHref({ basePath, page: 1, query })}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white px-3 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#9a3412]"
            >
              1
            </Link>
            {visiblePages[0] > 2 ? (
              <span className="inline-flex h-10 min-w-10 items-center justify-center text-sm font-semibold text-[#9ca3af]">
                ...
              </span>
            ) : null}
          </>
        ) : null}

        {visiblePages.map((page) => {
          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={getPageHref({ basePath, page, query })}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition ${
                isActive
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#e7e5e4] bg-white text-[#374151] hover:border-[#fdba74] hover:text-[#9a3412]"
              }`}
            >
              {page}
            </Link>
          );
        })}

        {visiblePages[visiblePages.length - 1] < totalPages ? (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 ? (
              <span className="inline-flex h-10 min-w-10 items-center justify-center text-sm font-semibold text-[#9ca3af]">
                ...
              </span>
            ) : null}
            <Link
              href={getPageHref({ basePath, page: totalPages, query })}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white px-3 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#9a3412]"
            >
              {totalPages}
            </Link>
          </>
        ) : null}

        {currentPage < totalPages ? (
          <Link
            href={getPageHref({ basePath, page: currentPage + 1, query })}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white px-4 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#9a3412]"
          >
            Sonraki
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
