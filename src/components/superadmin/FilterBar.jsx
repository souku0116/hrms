import * as React from "react";
import { Search, Filter, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Filter bar component for tables. */
export function FilterBar({
  onSearch,
  onFilter,
  searchPlaceholder = "Search...",
  showAddButton = false,
  className,
  filterOptions,
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-md border bg-background px-3 py-2 pl-10 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Filter button */}
        {filterOptions && (
          <Button variant="outline" size="sm" onClick={onFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        )}
      </div>

      {/* Add button */}
      {showAddButton && (
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      )}
    </div>
  );
}

export default FilterBar;
