import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../utils/Utils";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  if (!userInfo) {
    // Handle case where userInfo is null or undefined
    console.error("User info is not available");
    return <Navigate to="/" />;
  }

  return userInfo.isAdmin ? <>{children}</> : <Navigate to="/" />;
}
