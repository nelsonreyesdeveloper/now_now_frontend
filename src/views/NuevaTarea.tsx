import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuthContext";

const NuevaTarea = () => {
  const { token, user, obteniendoUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      obteniendoUser();
    }
  }, [token]); //eslint-disable-line

  useEffect(() => {
    if (user) {
      if (user.defaultPassword === 1) {
        navigate("/primer-ingreso");
      }
      if (user.roles[0].name !== "super-admin") {
        navigate("/dashboard");
      }
    }
  }, [user]); //eslint-disable-line
  return (
    <Card>
      <CardHeader>
        <CardTitle>NUEVA TAREA</CardTitle>
        <CardDescription>
          <p className="mt-3"> En esta seccion podras ver tus tareas.</p>
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default NuevaTarea;
