import { Navigate, Outlet } from "react-router-dom";
import { useLogin } from "@/context/LoginContext";

const PublicRoute = () => {
  const { isLoggedIn } = useLogin();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
