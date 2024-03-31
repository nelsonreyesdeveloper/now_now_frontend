import useAuthContext from "@/hooks/useAuthContext";
import { User } from "@/types/types";
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
  changueStatusTarea?: (data: any) => Promise<any>;
  enviarComentariosTarea?: (data: any) => Promise<any>;
  comentariosDeleteTarea?: (data: any) => Promise<any>;
  deleteTarea?: (data: any) => Promise<any>;
  editarTareaPath?: (data: any, id: number) => Promise<any>;
  downloadFile?: (archivo: any, enlace: string) => Promise<any>;
  borrarArchivo?: (archivoId: number, TareaId: number) => Promise<any>;
  uploadFile?: (data: any) => Promise<any>;
  generarReporte?: (data: any) => Promise<any>;
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
  changueStatusTarea: () => Promise.resolve([]),
  enviarComentariosTarea: () => Promise.resolve([]),
  comentariosDeleteTarea: () => Promise.resolve([]),
  deleteTarea: () => Promise.resolve([]),
  editarTareaPath: () => Promise.resolve([]),
  downloadFile: () => Promise.resolve([]),
  borrarArchivo: () => Promise.resolve([]),
  uploadFile: () => Promise.resolve([]),
  generarReporte: () => Promise.resolve([]),
});

const TareasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuthContext();
  const doc = new jsPDF({
    orientation: "landscape", // Orientación vertical
    unit: "in", // Unidad de medida en pulgadas
    format: "letter", // Tamaño de hoja oficio (similar a A4)
  });

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
      return dataFormatted;
    } catch (error) {
      toast.error("Error en el servidor, intente más tarde");
      console.log(error);
    }
  }
  const editarTareaPath = async (data: any, id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tareas/${id}`,
        {
          method: "PUT",
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
      toast.error("Error en el servidor, intente más tarde");
      return false;
    }
  };
  const enviarComentariosTarea = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/comentarios`,
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
      toast.error("Error en el servidor, intente más tarde");
      return false;
    }
  };
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

      const data = await response.json();

      const dataFormatted: [] = data.data.map((user: formatedSelect) => {
        return {
          value: user.id as number,
          label: `${user.name}  ` as string,
        };
      });
      return dataFormatted;
    } catch (error) {
      toast.error("Error en el servidor, intente más tarde");
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
        toast.success(response2.message);

        return true;
      } else {
        console.log("Error al crear la tarea");
      }
    } catch (error) {
      toast.error("Error en el servidor, intente más tarde");
      return false;
    }
  };

  const deleteTarea = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tareas/${data}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );
      if (response.ok) {
        const response2 = await response.json();
        toast.success(response2.message);
        return true;
      } else {
        const res = await response.json();
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Error en el servidor, intente más tarde");
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
      toast.error("Error en el servidor, intente más tarde");
      return false;
    }
  };

  const changueStatusTarea = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tareas/${data.tarea_id}`,
        {
          method: "PATCH",
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
      toast.error("Error en el servidor, intente más tarde");
      return false;
    }
  };

  const ObtenerTodasLasTareas = async (current_page, titulo) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tareas?page=${
          current_page ?? 1
        }&titulo=${titulo ?? ""}`,
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
      return data;
    } catch (error) {
      toast.error("Error en el servidor, intente más tarde");
    }
  };

  const downloadFile = async (archivo) => {
    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/archivos?ruta=${archivo.ruta}`,
        {
          method: "GET",
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data", // Common for file uploads
            Authorization: `Bearer ${token}`,
            accept: "multipart/form-data",
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await respuesta.blob();
      const urlDescarga = window.URL.createObjectURL(blob);

      const nuevoenlace = document.createElement("a");
      nuevoenlace.href = urlDescarga;

      nuevoenlace.download = archivo.nombreOriginal;
      nuevoenlace.click();

      // Opcional: Eliminar URL temporal después de la descarga (limpieza)
      setTimeout(() => window.URL.revokeObjectURL(urlDescarga), 1000);
    } catch (error) {
      console.log(error);
      toast.error("Error en el servidor, intente más tarde");
    }
  };

  const borrarArchivo = async (archivoId, TareaId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/archivos/${archivoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
          body: JSON.stringify({ tarea_id: TareaId }),
        }
      );
      if (response.ok) {
        const response2 = await response.json();
        toast.success(response2.message);
        return true;
      } else {
        const res = await response.json();
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Error en el servidor, intente más tarde");
      return false;
    }
  };
  const comentariosDeleteTarea = async (data: any) => {
    {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/comentarios`,
          {
            method: "DELETE",
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
        toast.error("Error en el servidor, intente más tarde");
      }
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
  const uploadFile = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/archivos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      if (response.ok) {
        const response2 = await response.json();
        toast.success(response2.message);
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error ?? "Error al subir el archivo.");
      }
    } catch (error) {
      toast.error("Error al subir el archivo.");
      return false;
    }
  };

  const generarReporte = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/generar-reporte`,
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

        const tableData = response2.reporte.tareas.map((tarea) => {
          return [
            tarea.titulo,
            tarea.descripcion,
            tarea.estado,
            tarea.tiempo,
            tarea.usuario,
          ];
        });

        const head = ["Título", "Descripción", "Estado", "Tiempo", "Usuario"];
        autoTable(doc, {
          headStyles: {
            halign: "center",
            fontSize: 13,
            fillColor: [0, 0, 0],
          },
          pageBreak: "auto",
          bodyStyles: {
            halign: "center",
            fontSize: 10,
            fillColor: [255, 255, 255],
            lineColor: [0, 0, 0],
            valign: "middle",
          },
          head: [head],
          body: tableData,
        });

        doc.save(
          `reporte-${response2.reporte.fecha_inicio}-a-${response2.reporte.fecha_fin}.pdf`
        );

        return true;
      } else {
        const data = await response.json();

        toast.error(data.error ?? "Error al generar el reporte");
      }
    } catch (error) {
      toast.error("Error al generar el reporte");
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
    changueStatusTarea,
    enviarComentariosTarea,
    comentariosDeleteTarea,
    deleteTarea,
    editarTareaPath,
    downloadFile,
    borrarArchivo,
    uploadFile,
    generarReporte,
  };
  return (
    <TareasContext.Provider value={value}>{children}</TareasContext.Provider>
  );
};

export default TareasProvider;
