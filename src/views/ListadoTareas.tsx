import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTareasContext } from "@/hooks/useTareasContext";
import { useState, useEffect } from "react";
import useAuthContext from "@/hooks/useAuthContext";
import { FaCommentDots, FaPaperclip } from "react-icons/fa";
const ListadoTareas = () => {
  const { ObtenerTodasLasTareas } = useTareasContext();
  const [tareas, setTareas] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState([]);
  const { user } = useAuthContext();
  const getListadoTareas = async () => {
    console.log(user);
    if (!user || user.defaultPassword === 1) return;
    const resultado = await ObtenerTodasLasTareas();
    if (resultado) {
      setTareas(resultado.tareas.data);
    }
  };
  useEffect(() => {
    getListadoTareas();
  }, []);

  useEffect(() => {
    console.log(commentsVisible);
  }, [commentsVisible]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>LISTADO DE TAREAS</CardTitle>
        <CardDescription>
          En esta seccion podras ver tus tareas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {tareas.map((tarea) => (
            <div
              key={tarea.id}
              className="flex flex-col mb-4 border rounded-lg p-4"
            >
              <div className="flex justify-between mb-5">
                <p className="font-bold">
                  Persona Asignada:{" "}
                  <span className="font-light">{tarea.user.name}</span>
                </p>

                <p className="font-bold">
                  Estado: {console.log(tarea.estado_id)}
                  <span
                  
                    className={`
                      ${
                        tarea.estado_id === 1
                          ? "bg-orange-500"
                          : tarea.estado_id === 2
                          ? "bg-purple-600"
                          : tarea.estado_id === 3
                          ? "bg-red-500"
                          : "bg-green-500"
                      }

                      text-black px-2 py-1 rounded
                      `}
                  >
                    {tarea.estado_id === 1
                      ? "Pendiente"
                      : tarea.estado_id === 2
                      ? "En Proceso"
                      : tarea.estado_id === 3
                      ? "Bloqueado"
                      : "Completado"}
                  </span>
                </p>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{tarea.titulo}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    onClick={() => {
                      console.log("Comments button clicked");
                      // console.log(tarea.?comentarios);
                      if (commentsVisible.includes(tarea.id)) {
                        setCommentsVisible(
                          commentsVisible.filter((id) => id !== tarea.id)
                        );
                        return;
                      }
                      setCommentsVisible([
                        ...commentsVisible.filter((id) => id !== tarea.id),
                        tarea.id,
                      ]);
                    }}
                  >
                    <FaCommentDots size={20} />
                    {tarea.comentarios.length > 0 && (
                      <span className="text-sm font-bold">
                        {tarea.comentarios.length}
                      </span>
                    )}
                  </button>
                  <label htmlFor={`file-upload-${tarea.id}`}>
                    <FaPaperclip
                      size={20}
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    />
                  </label>
                  <input
                    id={`file-upload-${tarea.id}`}
                    type="file"
                    className="hidden"
                    // onChange={handleFileChange}
                  />
                  <button
                    className="disabled:text-gray-400 hover:text-blue-700 focus:outline-none disabled:cursor-not-allowed"
                    // onClick={() => handleFileUpload(tarea.id)}
                    // disabled={!selectedFile}
                  >
                    Subir Archivo
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{tarea.descripcion}</p>

              {/* Conditionally render comments based on commentsVisible state */}
              {commentsVisible.includes(tarea.id) && (
                <div className="comments">
                  {tarea.comentarios.length > 0 ? (
                    tarea.comentarios.map((comentario) => (
                      <div key={comentario.id} className="comment">
                        <p className="font-bold">{comentario.user.name}</p>
                        <p>{comentario.comentario}</p>
                      </div>
                    ))
                  ) : (
                    <p className="mt-4 text-gray-500 ">No hay comentarios</p>
                  )}
                  <input
                    className="mt-2  w-[90%]  p-1 border-gray-300 border-2 border-solid rounded-md w-full"
                    placeholder="Comenta algo"
                    type="text"
                  />
                </div>
              )}
              {/* Implement comment section here (conditionally rendered based on state) */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListadoTareas;
