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
            <h1 className="text-3xl font-bold text-textPrimary">Unable to sign in</h1>
            <p className="text-textSecondary">
              The email or password you entered is incorrect. Please try again.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link to={ROUTES.LOGIN} className="block">
            <Button className="w-full">Try Again</Button>
          </Link>
          <Link to={ROUTES.FORGOT_PASSWORD} className="block">
            <Button variant="outline" className="w-full">
              Forgot Password?
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
