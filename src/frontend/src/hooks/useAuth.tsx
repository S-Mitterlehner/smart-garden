import { createContext, useContext, useState } from "react";

export type AuthValue = {
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  login: (username: string, password: string) => void;
};

const AuthContext = createContext<AuthValue>({
  isLoggedIn: false,
  isLoading: false,
  token: null,
  login: () => {},
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

  const login = (username: string, password: string) => {
    setIsLoading(true);
    // TODO: Make more dynamic
    fetch("https://localhost:7006/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log("Login response:", r);
        setToken(r.token);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        // Handle network error
        console.error("Network error during login:", error);
      });
  };

  return {
    isLoading,
    isLoggedIn: token !== null,
    token,
    login,
  };
}
