import * as React from "react";
import { ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";

/** Responsive data table component. */
export function DataTable({ columns, data, renderRow, onRowClick, className, loading }) {
  if (loading) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-textSecondary">Loading...</p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-textSecondary">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-surface">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider w-12">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className="hover:bg-surface transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {renderRow(row)}
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="h-4 w-4 text-muted inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default DataTable;
