import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuthContext();

  if (!isLoggedIn) return <Navigate to="/login" />;

  return children;
}
