import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import UserDashboard from "../pages/dashboard/UserDashboard";
import ContactHistory from "../pages/contact/ContactHistory";

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
