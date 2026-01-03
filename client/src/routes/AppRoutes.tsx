import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import UserDashboard from "../pages/dashboard/UserDashboard";
import ContactHistory from "../pages/contact/ContactHistory";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRouter";
import MyHistory from "@/pages/contact/MyHistory";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <UserDashboard /> },
          {path:"/my-history",element:<MyHistory />},
          { path: "history", element: <ContactHistory /> },
        ],
      },
    ],
  },
]);
