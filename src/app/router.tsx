import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import MentorLayout from "@/layouts/MentorLayout";
import MenteeLayout from "@/layouts/MenteeLayout";

import LoginPage from "@/pages/auth/LoginPage";

import MentorHomePage from "@/pages/mentor/HomePage";
import MentorTasksPage from "@/pages/mentor/TasksPage";
import MentorFeedbackPage from "@/pages/mentor/FeedbackPage";
import MentorTodoPage from "@/pages/mentor/TodoPage";
import MentorMenteesPage from "@/pages/mentor/MenteesPage";
import MentorSettingsPage from "@/pages/mentor/SettingsPage";

import MenteeTasksPage from "@/pages/mentee/TasksPage";
import MenteeMyPage from "@/pages/mentee/MyPage";
import MenteeCalendarPage from "@/pages/mentee/CalendarPage/index";
import MenteeActivityPage from "@/pages/mentee/ActivityPage";

import NotFoundPage from "@/pages/notfound/NotFoundPage";

export const router = createBrowserRouter([
  // 기본 진입
  { path: "/", element: <Navigate to="/auth/login" replace /> },

  // Auth
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> }
    ],
  },

  // Mentor (PC)
  {
    path: "/mentor",
    element: <MentorLayout />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <MentorHomePage /> },
      { path: "tasks", element: <MentorTasksPage /> },
      { path: "feedback", element: <MentorFeedbackPage /> },
      { path: "todo", element: <MentorTodoPage /> },
      { path: "mentees", element: <MentorMenteesPage /> },
      { path: "settings", element: <MentorSettingsPage /> },
    ],
  },

  // Mentee (WebApp)
  {
    path: "/mentee",
    element: <MenteeLayout />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "mypage", element: <MenteeMyPage /> },
      { path: "tasks", element: <MenteeTasksPage /> },
      { path: "calendar", element: <MenteeCalendarPage /> },
      { path: "activity", element: <MenteeActivityPage /> },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);
