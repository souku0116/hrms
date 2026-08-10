import React, { useState } from "react";
import Card from "@/components/ui/Card";
import { PageHeader, FilterBar } from "@/components/superadmin";
import { mockAuditLogs } from "@/data/superadminMockData";

/** Audit logs page. */
export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.organization.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = [...new Set(mockAuditLogs.map((log) => log.action))];

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <PageHeader title="Audit Logs" subtitle="Track important activity across WorkSync." />

      {/* Content area */}
      <main className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filter bar */}
          <FilterBar
            searchPlaceholder="Search audit logs..."
            onSearch={setSearch}
            showAddButton={false}
          />

          {/* Action filter */}
          <div>
            <p className="text-xs font-semibold text-textSecondary uppercase mb-2">Action</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActionFilter("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  actionFilter === "all"
                    ? "bg-primary text-background"
                    : "bg-surface text-textSecondary hover:bg-border"
                }`}
              >
                All
              </button>
              {uniqueActions.map((action) => (
                <button
                  key={action}
                  onClick={() => setActionFilter(action)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    actionFilter === action
                      ? "bg-primary text-background"
                      : "bg-surface text-textSecondary hover:bg-border"
                  }`}
                >
                  {action.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Log entries */}
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <Card>
                <div className="flex items-center justify-center py-12">
                  <p className="text-textSecondary">No audit logs found.</p>
                </div>
              </Card>
            ) : (
              filteredLogs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-textPrimary mb-2">{log.entity}</p>
                        <p className="text-sm text-textSecondary mb-3">{log.details}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <p className="font-semibold text-textSecondary">Actor</p>
                            <p className="text-textPrimary mt-1">{log.actor}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-textSecondary">Organization</p>
                            <p className="text-textPrimary mt-1">{log.organization}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-textSecondary">Timestamp</p>
                            <p className="text-textPrimary mt-1">{log.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
