import { Navigate, Outlet } from "react-router-dom";
import { useLogin } from "@/context/LoginContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useLogin();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
