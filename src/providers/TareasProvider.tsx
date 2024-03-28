import useAuthContext from "@/hooks/useAuthContext";
import { User } from "@/types/types";
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
// Importa las funciones necesarias para realizar las peticiones HTTP
type formatedSelect = { value: number; label: string };
interface TareasContextProps {
  ObtenerTodosLosUsuarios: () => Promise<[]>;
  token: string;
  ObtenerTodosLosUsuariosPorSearch: (search: string) => Promise<[]>;
  nuevaTareaPost: (data: any) => Promise<any>;
  nuevoUsuarioPost?: (data: any) => Promise<any>;
  forgotPassword?: (data: string) => Promise<any>;
  ObtenerTodasLasTareas?: () => Promise<any>;
  resetPassword?: (data: any) => Promise<any>;
}

export const TareasContext = createContext<TareasContextProps>({
  ObtenerTodosLosUsuarios: () => Promise.resolve([]),
  token: "",
  ObtenerTodosLosUsuariosPorSearch: () => Promise.resolve([]),
  nuevaTareaPost: () => Promise.resolve([]),
  nuevoUsuarioPost: () => Promise.resolve([]),
  forgotPassword: () => Promise.resolve([]),
  ObtenerTodasLasTareas: () => Promise.resolve([]),
  resetPassword: () => Promise.resolve([]),
});

const TareasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuthContext();

  async function ObtenerTodosLosUsuarios(): Promise<[]> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );
      const data = await response.json();

      const dataFormatted: [] = data.data.map((user: formatedSelect) => {
        return {
          value: user.id as number,
          label: `${user.name}  ` as string,
        };
      });
      console.log(dataFormatted);
      return dataFormatted;
    } catch (error) {
      console.log(error);
    }
  }
  async function ObtenerTodosLosUsuariosPorSearch(search: string): Promise<[]> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users?search=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );

      console.log(response);
      const data = await response.json();

      const dataFormatted: [] = data.data.map((user: formatedSelect) => {
        return {
          value: user.id as number,
          label: `${user.name}  ` as string,
        };
      });
      console.log(dataFormatted);
      return dataFormatted;
    } catch (error) {
      console.log(error);
    }
  }

  const nuevaTareaPost = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tareas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const response2 = await response.json();
        console.log(response2.message);
        toast.success(response2.message);

        return true;
      } else {
        console.log("Error al crear la tarea");
      }
    } catch (error) {
      return false;
    }
  };

  const nuevoUsuarioPost = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const response2 = await response.json();
        toast.success(response2.message);
        return true;
      } else {
        const res = await response.json();
        toast.error(res.message);
      }
    } catch (error) {
      return false;
    }
  };

  const ObtenerTodasLasTareas = async () => {
    console.log(token);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tareas`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const forgotPassword = async (data: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ email: data }),
        }
      );
      if (response.ok) {
        const response2 = await response.json();
        toast.success(response2.message);
        return true;
      } else {
        const data = await response.json();

        toast.error(
          data.error ?? "Error al enviar el correo, revisa el formato."
        );
      }
    } catch (error) {
      toast.error("Error al enviar el correo, revisa el formato.");
      return false;
    }
  };

  const resetPassword = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const response2 = await response.json();
        toast.success(response2.message);
        return true;
      } else {
        const data = await response.json();

        toast.error(data.error ?? "Error al restablecer la contraña.");
      }
    } catch (error) {
      toast.error("Error al restablecer la contraña.");
      return false;
    }
  };
  const value = {
    ObtenerTodosLosUsuarios,
    token,
    ObtenerTodosLosUsuariosPorSearch,
    nuevaTareaPost,
    nuevoUsuarioPost,
    forgotPassword,
    ObtenerTodasLasTareas,
    resetPassword,
  };
  return (
    <TareasContext.Provider value={value}>{children}</TareasContext.Provider>
  );
};

export default TareasProvider;
