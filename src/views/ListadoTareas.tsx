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
  const [commentsVisible, setCommentsVisible] = useState({});
  const { user } = useAuthContext();
  const getListadoTareas = async () => {
    if (!user) return;
    const resultado = await ObtenerTodasLasTareas();
    if (resultado) {
      setTareas(resultado.tareas.data);
    }
  };
  useEffect(() => {
    getListadoTareas();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>LISTADO DE TAREAS</CardTitle>
        <CardDescription>
          <p className="mt-3"> En esta seccion podras ver tus tareas.</p>
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
                  Estado:{" "}
                  {tarea.id_estado === 1
                    ? "Pendiente"
                    : tarea.id_estado === 2
                    ? "En Proceso"
                    : tarea.id_estado === 3
                    ? "Bloqueado"
                    : "Completado"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{tarea.titulo}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    onClick={() => {
                      console.log("Comments button clicked");

                      if (commentsVisible === tarea.id) {
                        setCommentsVisible(null);
                        return;
                      }

                      setCommentsVisible(tarea.comentarios[0].tarea_id);
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
              {commentsVisible === tarea.id && (
                <div className="comments">
                  <h4 className="font-semibold my-3 underline">Comentarios</h4>
                  <ul>
                    {tarea.comentarios.map((comment) => (
                      <div className="flex gap-2 border-b border-gray-100 mb-3 p-2">
                        <span className="font-bold">{comment.user.name}:</span>
                        <li key={comment.id}>{comment.comentario}</li>
                      </div>
                    ))}
                  </ul>
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
