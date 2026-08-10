import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { PageHeader, FilterBar } from "@/components/superadmin";
import { StatusBadge } from "@/components/superadmin/Badges";
import { mockOrganizations } from "@/data/superadminMockData";
import { ROUTES } from "@/routes/routeConstants";
import { MoreHorizontal, Eye } from "lucide-react";

/** Organizations list page. */
export default function Organizations() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrgs = mockOrganizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.admin.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (org) => {
    navigate(ROUTES.SUPERADMIN_ORGANIZATION_DETAIL.replace(":id", org.id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <PageHeader
        title="Organizations"
        subtitle="Manage all companies using WorkSync."
        actions={<Button>Add Organization</Button>}
      />

      {/* Content area */}
      <main className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filter bar */}
          <FilterBar
            searchPlaceholder="Search organizations..."
            onSearch={setSearch}
            showAddButton={false}
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {["all", "Active", "Suspended", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-primary text-background"
                    : "bg-surface text-textSecondary hover:bg-border"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>

          {/* Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-surface">
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrgs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <p className="text-textSecondary">No organizations found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrgs.map((org) => (
                      <tr
                        key={org.id}
                        className="hover:bg-surface transition-colors cursor-pointer"
                        onClick={() => handleRowClick(org)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={org.logo} alt={org.name} className="h-8 w-8 rounded-full" />
                            <span className="font-medium text-textPrimary">{org.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-textSecondary">{org.admin}</td>
                        <td className="px-6 py-4 text-textSecondary">{org.users}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={org.status} />
                        </td>
                        <td className="px-6 py-4 text-textSecondary">{org.created}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1 hover:bg-surface rounded-md transition-colors">
                              <Eye className="h-4 w-4 text-textSecondary" />
                            </button>
                            <button className="p-1 hover:bg-surface rounded-md transition-colors">
                              <MoreHorizontal className="h-4 w-4 text-textSecondary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
