import { Navigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedRoute = ({ children }: any) => {
  const isAdmin = localStorage.getItem("admin-auth") === "true";

  return isAdmin ? children : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
