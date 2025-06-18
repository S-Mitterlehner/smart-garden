import { createContext, useContext, useState } from "react";

export type AuthValue = {
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<string | null>;
  register: (username: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthValue>({
  isLoggedIn: false,
  isLoading: false,
  token: null,
  login: async () => null,
  register: async () => null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export function useAuth(): AuthValue {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const body = JSON.stringify({ username, password });
      // todo: make these urls more dynamic
      const res = await fetch("https://localhost:7006/login", {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        return data.message || "Invalid username or password.";
      }

      // Maybe persist the token?
      setToken(data.token);
      return null;
    } catch (error) {
      console.error("Auth error:", error);
      return "Network error. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const body = JSON.stringify({ username, password });
      // todo: make these urls more dynamic
      const res = await fetch("https://localhost:7006/register", {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        return "Registration failed.";
      }

      return null;
    } catch (error) {
      console.error("Auth error:", error);
      return "Network error. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isLoggedIn: token !== null,
    token,
    login,
    register
  };
}
