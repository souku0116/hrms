import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/routes/routeConstants";
import { AlertCircle } from "lucide-react";

export default function LoginError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-error" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-textPrimary">Account profile unavailable</h1>
            <p className="text-textSecondary">
              Your sign-in succeeded, but WorkSync could not load your account profile. Please ask
              your administrator to check the profile setup and try again.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link to={ROUTES.LOGIN} className="block">
            <Button className="w-full">Try Again</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
