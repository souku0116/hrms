import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/routes/routeConstants";
import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleGoToDashboard = () => {
    if (role === "superadmin") {
      navigate(ROUTES.SUPERADMIN);
    } else if (role === "admin") {
      navigate(ROUTES.ADMIN);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-error" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-textPrimary">Access denied</h1>
            <p className="text-textSecondary">
              You don&apos;t have permission to access this area.
            </p>
          </div>
        </div>

        <Button onClick={handleGoToDashboard} className="w-full">
          Go to your dashboard
        </Button>
      </div>
    </div>
  );
}
