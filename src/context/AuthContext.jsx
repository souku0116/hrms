import React, { createContext, useState, useEffect, useCallback } from "react";
import supabase from "@/lib/supabaseClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile from profiles table
  const fetchProfile = useCallback(async (userId) => {
    try {
      if (!userId) {
        setProfile(null);
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
        setRole(null);
        return null;
      }

      setProfile(data);
      setRole(data?.role || null);
      return data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Profile fetch error:", err);
      setError(err.message);
      setProfile(null);
      setRole(null);
      return null;
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
      if (newSession?.user) {
        setUser(newSession.user);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await fetchProfile(newSession.user.id);
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
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

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setError(null);
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
    role,
    loading,
    error,
    signIn,
    signOut,
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
