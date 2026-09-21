import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LandingPage } from "@/pages/LandingPage";
import { ResumeListPage } from "@/pages/ResumeListPage";
import { EditorPage } from "@/pages/EditorPage";
import { TemplatesPage } from "@/pages/TemplatesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter(
  [
    { path: "/", element: <LandingPage /> },
    {
      path: "/app",
      element: <AppShell />,
      children: [
        { index: true, element: <Navigate to="/app/resumes" replace /> },
        { path: "resumes", element: <ResumeListPage /> },
        { path: "resumes/:resumeId/edit", element: <EditorPage /> },
        { path: "templates", element: <TemplatesPage /> },
        { path: "settings", element: <SettingsPage /> },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ],
  { future: { v7_relativeSplatPath: true } },
);
