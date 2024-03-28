import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router";
import AuthProvider from "./providers/AuthProvider";
import TareasProvider from "./providers/TareasProvider";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <TareasProvider>
        <RouterProvider router={router} />
      </TareasProvider>
    </AuthProvider>
  </React.StrictMode>
);
