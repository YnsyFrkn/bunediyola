import { Pagination } from "@/components/ui/Pagination";

type AdminPaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemLabel: string;
  query?: Record<string, string | number | undefined>;
  showWhenSinglePage?: boolean;
};

export function AdminPagination(props: AdminPaginationProps) {
  return <Pagination {...props} />;
}
