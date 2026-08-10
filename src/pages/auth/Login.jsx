import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/routes/routeConstants";
import { Building2, Users, Shield, Eye, EyeOff } from "lucide-react";

const roleOptions = [
  {
    id: "superadmin",
    label: "Superadmin",
    icon: Shield,
    description: "Manage the WorkSync platform",
  },
  {
    id: "admin",
    label: "Admin",
    icon: Building2,
    description: "Manage your organization",
  },
  {
    id: "user",
    label: "User",
    icon: Users,
    description: "Access your employee workspace",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, role, loading } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (role === "superadmin") {
        navigate(ROUTES.SUPERADMIN, { replace: true });
      } else if (role === "admin") {
        navigate(ROUTES.ADMIN, { replace: true });
      } else if (role === "user") {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, role, loading, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedRole) {
      newErrors.role = "Please select your account type";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        // Authentication failed
        navigate(ROUTES.LOGIN_ERROR, { replace: true });
        return;
      }

      if (!result.profile) {
        // Profile not found
        navigate(ROUTES.LOGIN_ERROR, { replace: true });
        return;
      }

      // Check account status
      if (result.profile.status === "inactive" || result.profile.status === "suspended") {
        navigate(ROUTES.ACCOUNT_DISABLED, { replace: true });
        return;
      }

      // Validate role match
      if (selectedRole !== result.profile.role) {
        navigate(ROUTES.WRONG_ROLE, { replace: true });
        return;
      }

      // All checks passed - redirect to appropriate dashboard
      if (result.profile.role === "superadmin") {
        navigate(ROUTES.SUPERADMIN, { replace: true });
      } else if (result.profile.role === "admin") {
        navigate(ROUTES.ADMIN, { replace: true });
      } else if (result.profile.role === "user") {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Login error:", err);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left side - Branding (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between bg-surface p-12 border-r">
        <div>
          <h1 className="text-4xl font-bold text-textPrimary mb-4">WorkSync</h1>
          <p className="text-textSecondary text-lg mb-8">
            Enterprise HRMS platform for modern workforce management
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-textPrimary">Enterprise Security</h3>
              <p className="text-sm text-textSecondary">Role-based access control</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-textPrimary">Unified Platform</h3>
              <p className="text-sm text-textSecondary">All-in-one workforce solution</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-textPrimary">Multi-tenant</h3>
              <p className="text-sm text-textSecondary">Manage multiple organizations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <h1 className="text-3xl font-bold text-textPrimary">WorkSync</h1>
          </div>

          {/* Form header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-textPrimary">Welcome back</h2>
            <p className="text-textSecondary">Sign in to your WorkSync account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-textPrimary">
                Select your account type
              </label>
              {errors.role && <p className="text-sm text-error">{errors.role}</p>}

              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((roleOption) => {
                  const Icon = roleOption.icon;
                  const isSelected = selectedRole === roleOption.id;

                  return (
                    <button
                      key={roleOption.id}
                      type="button"
                      onClick={() => setSelectedRole(roleOption.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-surface hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                            isSelected ? "text-primary" : "text-textSecondary"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium ${isSelected ? "text-primary" : "text-textPrimary"}`}
                          >
                            {roleOption.label}
                          </p>
                          <p className="text-sm text-textSecondary">{roleOption.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-textPrimary">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                disabled={isSubmitting}
                className={errors.email ? "border-error" : ""}
              />
              {errors.email && <p className="text-sm text-error">{errors.email}</p>}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-textPrimary">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  disabled={isSubmitting}
                  className={`pr-10 ${errors.password ? "border-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-error">{errors.password}</p>}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                <p className="text-sm text-error">{apiError}</p>
              </div>
            )}

            {/* Sign In Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-background border-t-current rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center pt-2">
              <a
                href={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
