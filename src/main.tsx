import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "@/routes";
import { startMocks } from "@/mocks/browser";
import "@/index.css";

const bootstrap = async () => {
  // 本项目没有后端：MSW 在 dev 与 preview/生产构建中都保持开启
  await startMocks();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
      <Toaster position="top-center" richColors closeButton />
    </React.StrictMode>,
  );
};

void bootstrap();
