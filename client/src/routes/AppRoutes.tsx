import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import UserDashboard from "../pages/UserDashboard";
import ContactHistory from "../pages/ContactHistory";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: "/history",
        element: <ContactHistory />,
      },
    ],
  },
]);
