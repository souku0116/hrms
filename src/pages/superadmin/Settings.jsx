import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { PageHeader } from "@/components/superadmin";
import { mockSettings } from "@/data/superadminMockData";
import { Save } from "lucide-react";

/** Settings page. */
export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(mockSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: "general", label: "General" },
    { id: "security", label: "Security" },
    { id: "email", label: "Email" },
    { id: "notifications", label: "Notifications" },
    { id: "system", label: "System" },
  ];

  const handleChange = (category, field, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value,
      },
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    // In production, would save to backend
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <PageHeader title="Settings" subtitle="Manage WorkSync platform settings." />

      {/* Content area */}
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

          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card>
                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                  <h3 className="font-semibold leading-none tracking-tight">General Settings</h3>
                </div>
                <div className="p-6 pt-0 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.platformName}
                      onChange={(e) => handleChange("general", "platformName", e.target.value)}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => handleChange("general", "supportEmail", e.target.value)}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-md">
                    <label className="text-sm font-medium text-textPrimary">Maintenance Mode</label>
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => handleChange("general", "maintenanceMode", e.target.checked)}
                      className="h-5 w-5 rounded border cursor-pointer"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                  <h3 className="font-semibold leading-none tracking-tight">Security Settings</h3>
                </div>
                <div className="p-6 pt-0 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Password Minimum Length
                    </label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        handleChange("security", "passwordMinLength", parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-md">
                    <label className="text-sm font-medium text-textPrimary">
                      Require Two-Factor Authentication
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorRequired}
                      onChange={(e) =>
                        handleChange("security", "twoFactorRequired", e.target.checked)
                      }
                      className="h-5 w-5 rounded border cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        handleChange("security", "sessionTimeout", parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <Card>
                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                  <h3 className="font-semibold leading-none tracking-tight">Email Configuration</h3>
                </div>
                <div className="p-6 pt-0 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      SMTP Server
                    </label>
                    <input
                      type="text"
                      value={settings.email.smtpServer}
                      onChange={(e) => handleChange("email", "smtpServer", e.target.value)}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleChange("email", "smtpPort", parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      From Address
                    </label>
                    <input
                      type="email"
                      value={settings.email.fromAddress}
                      onChange={(e) => handleChange("email", "fromAddress", e.target.value)}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                  <h3 className="font-semibold leading-none tracking-tight">
                    Notification Settings
                  </h3>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-md">
                    <label className="text-sm font-medium text-textPrimary">
                      Email Notifications
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotificationsEnabled}
                      onChange={(e) =>
                        handleChange("notifications", "emailNotificationsEnabled", e.target.checked)
                      }
                      className="h-5 w-5 rounded border cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-md">
                    <label className="text-sm font-medium text-textPrimary">
                      Slack Integration
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.slackIntegrationEnabled}
                      onChange={(e) =>
                        handleChange("notifications", "slackIntegrationEnabled", e.target.checked)
                      }
                      className="h-5 w-5 rounded border cursor-pointer"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <Card>
                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                  <h3 className="font-semibold leading-none tracking-tight">System Information</h3>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-md">
                    <div>
                      <p className="text-sm font-medium text-textPrimary">API Version</p>
                      <p className="text-xs text-textSecondary mt-1">
                        {settings.system.apiVersion}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-md">
                    <div>
                      <p className="text-sm font-medium text-textPrimary">Database Connection</p>
                      <p
                        className={`text-xs mt-1 ${
                          settings.system.databaseConnected ? "text-success" : "text-error"
                        }`}
                      >
                        {settings.system.databaseConnected ? "Connected" : "Disconnected"}
                      </p>
                    </div>
                    <div
                      className={`h-3 w-3 rounded-full ${
                        settings.system.databaseConnected ? "bg-success" : "bg-error"
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-md">
                    <div>
                      <p className="text-sm font-medium text-textPrimary">Cache</p>
                      <p
                        className={`text-xs mt-1 ${
                          settings.system.cacheEnabled ? "text-success" : "text-warning"
                        }`}
                      >
                        {settings.system.cacheEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <div
                      className={`h-3 w-3 rounded-full ${
                        settings.system.cacheEnabled ? "bg-success" : "bg-warning"
                      }`}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Save button */}
          {hasChanges && (
            <div className="fixed bottom-6 right-6">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
