export function parsePageParam(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  return {
    items: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    pagination: {
      currentPage,
      pageSize,
      totalCount: items.length,
      totalPages,
    },
  };
}
