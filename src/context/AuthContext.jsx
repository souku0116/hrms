import React, { createContext, useState, useEffect, useCallback } from "react";
import supabase from "@/lib/supabaseClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeMembership, setActiveMembership] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecoverySession, setIsRecoverySession] = useState(false);

  // Fetch user profile from profiles table
  const fetchProfile = useCallback(async (userId) => {
    try {
      if (!userId) {
        setProfile(null);
        setActiveMembership(null);
        setRole(null);
        return null;
      }

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select(
          "id, organization_id, first_name, last_name, email, avatar_url, role, status, created_at, updated_at",
        )
        .eq("id", userId)
        .single();

      if (fetchError) {
        if (fetchError.code !== "PGRST116") {
          // PGRST116 = no rows returned
          throw fetchError;
        }
        setProfile(null);
        setActiveMembership(null);
        setRole(null);
        return null;
      }

      const { data: memberships, error: membershipError } = await supabase
        .from("organization_memberships")
        .select("organization_id, role, status, organizations(id, name, slug)")
        .eq("user_id", userId)
        .order("status", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(1);
      if (membershipError) throw membershipError;

      const membership = memberships?.[0] || null;
      const membershipRole = membership?.role === "employee" ? "user" : membership?.role;
      const resolvedRole = data.role === "superadmin" ? "superadmin" : (membershipRole || data.role);
      const resolvedProfile = {
        ...data,
        role: resolvedRole,
        organization_id: membership?.organization_id || data.organization_id || null,
        organization: membership?.organizations || null,
        membership_status: data.role === "superadmin" ? null : (membership?.status || null),
      };

      setProfile(resolvedProfile);
      setActiveMembership(membership);
      setRole(resolvedRole || null);
      return resolvedProfile;
    } catch (err) {
      setError(err.message);
      setProfile(null);
      setActiveMembership(null);
      setRole(null);
      throw err;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          // eslint-disable-next-line no-console
          console.error(sessionError);
          throw sessionError;
        }

        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          // Fetch profile if user exists
          if (data.session.user?.id) {
            await fetchProfile(data.session.user.id);
          }
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
          setActiveMembership(null);
          setRole(null);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Auth initialization error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (event === "PASSWORD_RECOVERY") setIsRecoverySession(true);
      if (newSession?.user) {
        setUser(newSession.user);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          try {
            await fetchProfile(newSession.user.id);
          } catch {
            // Profile load errors are exposed through the context error state.
          }
        }
      } else {
        setUser(null);
        setProfile(null);
        setActiveMembership(null);
        setRole(null);
        setIsRecoverySession(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in with email and password
  const signIn = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          throw authError;
        }

        if (!data?.user) {
          throw new Error("No user returned from authentication");
        }

        setUser(data.user);
        setSession(data.session);

        // Fetch profile
        const profileData = await fetchProfile(data.user.id);

        return {
          user: data.user,
          session: data.session,
          profile: profileData,
          error: null,
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Sign in error:", err);
        setError(err.message);
        return {
          user: null,
          session: null,
          profile: null,
          error: err,
        };
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile],
  );

  const signUp = useCallback(async ({ email, password, firstName, lastName }) => {
    setLoading(true);
    setError(null);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { first_name: firstName.trim(), last_name: lastName.trim(), full_name: fullName } },
      });
      if (signUpError) throw signUpError;
      if (data?.session && data.user?.id) await fetchProfile(data.user.id);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const requestPasswordReset = useCallback(async (email) => {
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/forgot-password`,
      });
      if (resetError) setError(resetError.message);
      return { error: resetError };
    } catch (resetError) {
      setError(resetError.message);
      return { error: resetError };
    }
  }, []);

  const updatePassword = useCallback(async (password) => {
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) setError(updateError.message);
      else setIsRecoverySession(false);
      return { error: updateError };
    } catch (updateError) {
      setError(updateError.message);
      return { error: updateError };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
      setSession(null);
      setProfile(null);
      setActiveMembership(null);
      setRole(null);
      setError(null);
      setIsRecoverySession(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Sign out error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      return await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const value = {
    user,
    session,
    profile,
    activeMembership,
    role,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    isRecoverySession,
    refreshProfile,
    isAuthenticated: !!user && !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
