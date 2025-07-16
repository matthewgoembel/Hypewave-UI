import { createContext, useState } from "react";

// Create the context object
export const AuthContext = createContext();

/**
 * AuthProvider wraps your whole app and provides:
 * - token: the JWT
 * - user: user profile {email, id}
 * - isAuthenticated: boolean
 * - login(): saves credentials
 * - logout(): clears credentials
 */
export function AuthProvider({ children }) {
  // Always start unauthenticated
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Called after successful login
  const login = (token, user) => {
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Called to log out
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
