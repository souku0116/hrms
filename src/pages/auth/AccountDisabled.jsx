import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/routes/routeConstants";
import { Lock } from "lucide-react";

export default function AccountDisabled() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-error" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-textPrimary">Account unavailable</h1>
            <p className="text-textSecondary">
              Your WorkSync account is currently inactive or suspended. Please contact your
              administrator.
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
