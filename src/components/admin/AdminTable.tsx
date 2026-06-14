import type { ReactNode } from "react";

type Column = {
  key: string;
  title: string;
  className?: string;
};

type Row = {
  id: string;
  cells: Record<string, ReactNode>;
};

type AdminTableProps = {
  columns: Column[];
  rows: Row[];
};

export function AdminTable({ columns, rows }: AdminTableProps) {
  return (
    <div className="max-w-full overflow-hidden rounded-[28px] border border-[#f1e6dd] bg-white shadow-sm">
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="min-w-full divide-y divide-[#f3ebe3]">
          <thead className="bg-[#fff7ed]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-4 text-left text-sm font-semibold text-[#9a3412] ${column.className ?? ""}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5efe9]">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-sm leading-7 text-[#374151]">
                    {row.cells[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
