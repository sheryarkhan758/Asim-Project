import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../api/auth.js';
import { TOKEN_KEY, USER_KEY } from '../api/client.js';

const AuthContext = createContext(null);

// Read the persisted user (if any) once at startup.
function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  // Persist a session (or clear it) to localStorage and state together.
  const persistSession = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setToken(nextToken || null);
    setUser(nextUser || null);
  }, []);

  // Login -> store { token, user }.
  const login = useCallback(
    async (credentials) => {
      const { token: newToken, user: newUser } = await authApi.login(credentials);
      persistSession(newToken, newUser);
      return newUser;
    },
    [persistSession]
  );

  // Register -> the backend returns only { user } (no token), so we log the
  // user straight in afterwards with the same credentials for a smooth flow.
  const register = useCallback(
    async (data) => {
      await authApi.register(data);
      return login({ email: data.email, password: data.password });
    },
    [login]
  );

  // Logout -> best-effort server call, then clear the session regardless.
  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(TOKEN_KEY)) await authApi.logout();
    } catch {
      // token already invalid/expired, clearing locally is enough.
    }
    persistSession(null, null);
  }, [persistSession]);

  // Refresh the user record from the server (e.g. after a profile update).
  const loadProfile = useCallback(async () => {
    const { user: fresh } = await authApi.getProfile();
    setUser(fresh);
    localStorage.setItem(USER_KEY, JSON.stringify(fresh));
    return fresh;
  }, []);

  // Update profile details / saved addresses and persist the fresh user.
  const updateProfile = useCallback(async (data) => {
    const { user: updated } = await authApi.updateProfile(data);
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return updated;
  }, []);

  // On startup, if we have a token, validate it by loading the profile.
  useEffect(() => {
    let active = true;
    (async () => {
      if (localStorage.getItem(TOKEN_KEY)) {
        try {
          await loadProfile();
        } catch {
          if (active) persistSession(null, null);
        }
      }
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [loadProfile, persistSession]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    loadProfile,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
