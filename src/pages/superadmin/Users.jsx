import React, { useState } from "react";
import Card from "@/components/ui/Card";
import { PageHeader, FilterBar } from "@/components/superadmin";
import { StatusBadge, RoleBadge } from "@/components/superadmin/Badges";
import { mockUsers } from "@/data/superadminMockData";
import { MoreHorizontal, Eye } from "lucide-react";

/** Users list page. */
export default function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <PageHeader title="Users" subtitle="Manage users across all WorkSync organizations." />

      {/* Content area */}
      <main className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filter bar */}
          <FilterBar
            searchPlaceholder="Search users..."
            onSearch={setSearch}
            showAddButton={false}
          />

          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div>
              <p className="text-xs font-semibold text-textSecondary uppercase mb-2">Role</p>
              <div className="flex flex-wrap gap-2">
                {["all", "SUPERADMIN", "ADMIN", "USER"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      roleFilter === role
                        ? "bg-primary text-background"
                        : "bg-surface text-textSecondary hover:bg-border"
                    }`}
                  >
                    {role === "all" ? "All" : role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-textSecondary uppercase mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {["all", "Active", "Suspended"].map((status) => (
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
            </div>
          </div>

          {/* Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-surface">
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-textSecondary text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <p className="text-textSecondary">No users found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-surface transition-colors">
                        <td className="px-6 py-4 font-medium text-textPrimary">{user.name}</td>
                        <td className="px-6 py-4 text-textSecondary">{user.email}</td>
                        <td className="px-6 py-4 text-textSecondary">{user.organization}</td>
                        <td className="px-6 py-4">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 text-textSecondary text-xs">{user.lastActive}</td>
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
