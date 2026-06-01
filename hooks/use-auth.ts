import * as Auth from "@/lib/_core/auth";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseAuthOptions = {
  autoFetch?: boolean;
};

type SignInInput = {
  name: string;
  email?: string;
};

type UpdateUserInput = {
  name?: string | null;
  email?: string | null;
};

export function useAuth(options?: UseAuthOptions) {
  const { autoFetch = true } = options ?? {};
  const [user, setUser] = useState<Auth.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cachedUser = await Auth.getUserInfo();
      if (cachedUser) {
        setUser(cachedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch user");
      setError(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async ({ name, email }: SignInInput) => {
    const trimmedName = name.trim();
    const trimmedEmail = email?.trim() || null;
    if (!trimmedName) {
      throw new Error("Name is required");
    }

    const now = new Date();
    const nextUser: Auth.User = {
      id: Date.now(),
      openId: `local-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      loginMethod: "local",
      lastSignedIn: now,
    };

    await Auth.setUserInfo(nextUser);
    setUser(nextUser);
    setError(null);
    setLoading(false);
    return nextUser;
  }, []);

  const updateUser = useCallback(
    async (updates: UpdateUserInput) => {
      const currentUser = user ?? (await Auth.getUserInfo());
      if (!currentUser) {
        throw new Error("No active user session");
      }

      const nextUser: Auth.User = {
        ...currentUser,
        name: updates.name != null ? updates.name.trim() || null : currentUser.name,
        email: updates.email != null ? updates.email.trim() || null : currentUser.email,
        lastSignedIn: new Date(),
      };

      await Auth.setUserInfo(nextUser);
      setUser(nextUser);
      setError(null);
      return nextUser;
    },
    [user],
  );

  const logout = useCallback(async () => {
    await Auth.clearUserInfo();
    setUser(null);
    setError(null);
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    if (autoFetch) {
      void fetchUser();
    } else {
      setLoading(false);
    }
  }, [autoFetch, fetchUser]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    refresh: fetchUser,
    signIn,
    updateUser,
    logout,
  };
}
