import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../utils/Utils";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;
  if (!userInfo) {
    // Handle case where userInfo is null or undefined
    console.error("User info is not available");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
