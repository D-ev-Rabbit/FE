import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import MentorLayout from "@/layouts/MentorLayout";
import MenteeLayout from "@/layouts/MenteeLayout";

import LoginPage from "@/pages/auth/LoginPage";


import MentorDashboardPage from "@/pages/mentor/DashboardPage";
import MenteeHomePage from "@/pages/mentee/HomePage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
    ],
  },
  {
    path: "/mentor",
    element: <MentorLayout />,
    children: [{ path: "home", element: <MentorDashboardPage /> }],
  },
  {
    path: "/mentee",
    element: <MenteeLayout />,
    children: [{ path: "home", element: <MenteeHomePage /> }],
  },
]);
