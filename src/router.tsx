import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import Login from "./views/Login";
import RecuperarPassword from "./views/RecuperarPassword";
import { Dashboard } from "./layouts/DashBoardLayout";
import ListadoTareas from "./views/ListadoTareas";
import NuevaTarea from "./views/NuevaTarea";
import ValidarContraseñaPrimerIngreso from "./views/ValidarContraseñaPrimerIngreso";
import NuevosUsuarios from "./views/NuevosUsuarios";
import RecuperarPasswordToken from "./views/RecuperarPasswordToken";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        index: true,
        element: <Login></Login>,
      },
      {
        path: "forgot-password",
        element: <RecuperarPassword></RecuperarPassword>,
      },
      {
        path: "primer-ingreso",
        element: (
          <ValidarContraseñaPrimerIngreso></ValidarContraseñaPrimerIngreso>
        ),
      },
      {
        path: "password-reset",
        element: <RecuperarPasswordToken></RecuperarPasswordToken>,
      },
    ],
  },
  {
    path: "*",
    element: <div>404</div>,
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        index: true,
        element: <ListadoTareas></ListadoTareas>,
      },
      {
        path: "nueva-tarea",
        element: <NuevaTarea></NuevaTarea>,
      },
      {
        path: "nuevos-usuarios",
        element: <NuevosUsuarios></NuevosUsuarios>,
      },
    ],
  },
]);

export default router;
