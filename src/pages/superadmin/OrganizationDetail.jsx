import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import { StatusBadge } from "@/components/superadmin/Badges";
import { mockOrganizationDetail } from "@/data/superadminMockData";
import { ROUTES } from "@/routes/routeConstants";
import { ChevronLeft, Mail, Globe } from "lucide-react";

/** Organization detail page. */
export default function OrganizationDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("overview");

  // For now, using mock data - in production would fetch based on :id
  const org = mockOrganizationDetail;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "admins", label: "Admins" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b bg-surface px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(ROUTES.SUPERADMIN_ORGANIZATIONS)}
            className="flex items-center gap-2 mb-4 text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Organizations
          </button>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <img src={org.logo} alt={org.name} className="h-16 w-16 rounded-lg" />
              <div>
                <h1 className="text-3xl font-bold text-textPrimary">{org.name}</h1>
                <p className="text-sm text-textSecondary mt-1">Created on {org.created}</p>
              </div>
            </div>
            <StatusBadge status={org.status} />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 border-b mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-textSecondary hover:text-textPrimary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid gap-6">
              {/* Organization Info */}
              <Card>
                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                  <h3 className="font-semibold leading-none tracking-tight">
                    Organization Information
                  </h3>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-textSecondary uppercase">
                        Admin Name
                      </p>
                      <p className="text-sm text-textPrimary mt-1">{org.adminName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-textSecondary uppercase">
                        Admin Email
                      </p>
                      <p className="text-sm text-textPrimary mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {org.adminEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-textSecondary uppercase">Website</p>
                      <p className="text-sm text-textPrimary mt-1 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {org.website}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-textSecondary uppercase">Status</p>
                      <div className="mt-1">
                        <StatusBadge status={org.status} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-textSecondary uppercase">
                      Description
                    </p>
                    <p className="text-sm text-textPrimary mt-1">{org.description}</p>
                  </div>
                </div>
              </Card>

              {/* Statistics */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <h3 className="text-sm font-medium text-textSecondary">Total Users</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-2xl font-bold text-textPrimary">{org.usersCount}</p>
                    <p className="text-xs text-textSecondary mt-1">
                      {org.monthlyActiveUsers} active this month
                    </p>
                  </div>
                </Card>

                <Card>
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <h3 className="text-sm font-medium text-textSecondary">Administrators</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-2xl font-bold text-textPrimary">{org.adminsCount}</p>
                  </div>
                </Card>

                <Card>
                  <div className="flex flex-col space-y-1.5 p-6 pb-2">
                    <h3 className="text-sm font-medium text-textSecondary">Platform Usage</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-2xl font-bold text-textPrimary">{org.totalJobsPosted}</p>
                    <p className="text-xs text-textSecondary mt-1">jobs posted</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <Card>
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold leading-none tracking-tight">Users</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left font-semibold text-textSecondary">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-textSecondary">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-textSecondary">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {org.tabs.users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-surface">
                          <td className="px-4 py-3 text-textPrimary">{user.name}</td>
                          <td className="px-4 py-3 text-textSecondary">{user.email}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={user.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {/* Admins Tab */}
          {activeTab === "admins" && (
            <Card>
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold leading-none tracking-tight">Administrators</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left font-semibold text-textSecondary">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-textSecondary">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-textSecondary">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {org.tabs.admins.map((admin) => (
                        <tr key={admin.id} className="border-b hover:bg-surface">
                          <td className="px-4 py-3 text-textPrimary">{admin.name}</td>
                          <td className="px-4 py-3 text-textSecondary">{admin.email}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={admin.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <Card>
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold leading-none tracking-tight">Activity Log</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  {org.tabs.activity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-textPrimary">{activity.action}</p>
                        <p className="text-xs text-textSecondary">by {activity.actor}</p>
                      </div>
                      <p className="text-xs text-muted">{activity.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
