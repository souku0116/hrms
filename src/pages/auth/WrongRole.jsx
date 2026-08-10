import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/routes/routeConstants";
import { AlertTriangle } from "lucide-react";

export default function WrongRole() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-textPrimary">Incorrect account type</h1>
            <p className="text-textSecondary">
              Your account doesn&apos;t have access to the selected workspace. Please select the
              correct account type and try again.
            </p>
          </div>
        </div>

        <Link to={ROUTES.LOGIN} className="block">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </div>
    </div>
  );
}
