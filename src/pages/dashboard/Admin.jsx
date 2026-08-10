import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Building2 } from "lucide-react";

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-textPrimary">Admin Dashboard</h1>
              <p className="text-textSecondary mt-2">
                Welcome, {profile?.first_name} {profile?.last_name}
              </p>
            </div>

            {/* Placeholder content */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-8 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-textSecondary">Organization</p>
                    <p className="text-2xl font-bold text-textPrimary">
                      {profile?.organization_id ? "Linked" : "No org"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-textSecondary">Role</p>
                    <p className="text-2xl font-bold text-textPrimary capitalize">
                      {profile?.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-textSecondary">Status</p>
                    <p className="text-2xl font-bold text-textPrimary capitalize">
                      {profile?.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder message */}
            <div className="p-8 rounded-lg bg-surface border border-border text-center">
              <p className="text-textSecondary">
                Admin dashboard functionality coming soon. The authentication system is complete.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
