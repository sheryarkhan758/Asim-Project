import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

// Empty provider for now — user/session state will be added later.
export function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
