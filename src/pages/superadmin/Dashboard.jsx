import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import { PageHeader, StatCard, RecentActivity } from "@/components/superadmin";
import {
  mockDashboardStats,
  mockRecentActivity,
  mockOrganizations,
} from "@/data/superadminMockData";
import { BarChart3, Building2, Users, TrendingUp } from "lucide-react";

/** Superadmin dashboard page. */
export default function SuperadminDashboard() {
  const stats = mockDashboardStats;
  const recentOrgs = mockOrganizations.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <PageHeader title="Dashboard" subtitle="Here's what's happening across WorkSync." />

      {/* Content area */}
      <main className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Organizations"
              value={stats.totalOrganizations.toLocaleString()}
              trend={12}
              trendLabel="vs last month"
              icon={Building2}
            />
            <StatCard
              title="Active Organizations"
              value={stats.activeOrganizations.toLocaleString()}
              trend={8}
              trendLabel="vs last month"
              icon={Building2}
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              trend={15}
              trendLabel="vs last month"
              icon={Users}
            />
            <StatCard
              title="New Signups"
              value={stats.newSignups.toLocaleString()}
              trend={-3}
              trendLabel="vs last month"
              icon={TrendingUp}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Organization Growth Chart */}
            <Card>
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Organization Growth
                </h3>
              </div>
              <div className="p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.organizationGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--ws-colors-border)" />
                    <XAxis
                      dataKey="month"
                      stroke="var(--ws-colors-text-secondary)"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="var(--ws-colors-text-secondary)" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--ws-colors-background)",
                        border: "1px solid var(--ws-colors-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--ws-colors-primary-blue)"
                      dot={{ fill: "var(--ws-colors-primary-blue)", r: 4 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  User Growth
                </h3>
              </div>
              <div className="p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--ws-colors-border)" />
                    <XAxis
                      dataKey="month"
                      stroke="var(--ws-colors-text-secondary)"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="var(--ws-colors-text-secondary)" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--ws-colors-background)",
                        border: "1px solid var(--ws-colors-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--ws-colors-primary-blue)"
                      dot={{ fill: "var(--ws-colors-primary-blue)", r: 4 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Recent Organizations and Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Organizations */}
            <Card>
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold leading-none tracking-tight">
                    Recent Organizations
                  </h3>
                  <button className="text-primary text-sm hover:underline">View All</button>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  {recentOrgs.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center gap-3 pb-4 border-b last:pb-0 last:border-0"
                    >
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="h-10 w-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-textPrimary truncate">{org.name}</p>
                        <p className="text-xs text-textSecondary">{org.users} users</p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          org.status === "Active"
                            ? "bg-success/20 text-success"
                            : org.status === "Suspended"
                              ? "bg-error/20 text-error"
                              : "bg-warning/20 text-warning"
                        }`}
                      >
                        {org.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <RecentActivity activities={mockRecentActivity.slice(0, 5)} />
          </div>
        </div>
      </main>
    </div>
  );
}
