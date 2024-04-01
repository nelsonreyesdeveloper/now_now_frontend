import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTareasContext } from "@/hooks/useTareasContext";
import { useState, useEffect, ChangeEvent, BaseSyntheticEvent } from "react";
import useAuthContext from "@/hooks/useAuthContext";
import { FaCommentDots, FaPaperclip } from "react-icons/fa";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { toast } from "react-toastify";
import { estadosTareas } from "@/data/estados";
import { Check, DeleteIcon, Send, UploadCloud } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Pagination from "@/components/Pagination";
import validateFileType from "@/utils/validateExtension";
import { comentarioDelete, tarea } from "@/types/types";

type comentario = {
  tarea_id: number;
  comentario: string;
};
const ListadoTareas = () => {
  const {
    ObtenerTodasLasTareas,
    changueStatusTarea,
    enviarComentariosTarea,
    comentariosDeleteTarea,
    downloadFile,
    borrarArchivo,
    uploadFile,
  } = useTareasContext();
  const [tareas, setTareas] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState<number[]>([]);
  const { user } = useAuthContext();

  const [comentarioDelete, setComentarioDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedFile, setSelectedFile] = useState<number[]>([]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const { register, handleSubmit, watch, setValue } = useForm();

  const [loading, setLoading] = useState(false);

  const { show } = useContextMenu({});

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as Blob;
    const response2 = validateFileType(file);
    if (!response2) {
      /* borrar el archivo del input */

      e.target.value = "";
      return toast.error("Tipo de archivo no permitido");
    }

    const data = new FormData();

    const tarea_id = e.target.id.split("-")[2];

    data.append("archivo", file as Blob);
    data.append("tarea_id", tarea_id);

    Swal.fire({
      title: "Cargando...",
      text: "Por favor, espere...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await uploadFile(data);
    if (response) {
      getListadoTareas("");
      e.target.value = "";
    }
    Swal.close();
  };

  const handleDeleteArchivo = async (archivo_id: number, tarea_id: number) => {
    try {
      Swal.fire({
        title: "Cargando...",
        text: "Por favor, espere...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await borrarArchivo(archivo_id, tarea_id);

      if (response) {
        getListadoTareas("");
      }
      Swal.close();
    } catch (error) {
      toast.error("Error al borrar el archivo");
    }
  };

  function handleContextMenu(
    event: MouseEvent<HTMLElement, MouseEvent>,
    tareaId: number,
    estado: number
  ) {
    show({
      id: tareaId,
      event,
      position: { x: event.clientX - 250, y: event.clientY },
      props: { tarea: tareaId, estado: estado },
    });
  }

  const handleItemClick = async ({ id, event, props }, estado: number) => {
    const data = {
      tarea_id: props.tarea,
      estado_id: estado,
    };
    /* Modal cargando */
    Swal.fire({
      title: "Cargando...",
      text: "Por favor, espere...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await changueStatusTarea(data);

    if (response) {
      getListadoTareas("");
    }
    Swal.close();
  };

  const handleDeleteComment = async (
    comentario_id: number,
    tarea_id: number
  ) => {
    if (comentarioDelete) return;
    const data: comentarioDelete = {
      comentario_id,
      tarea_id,
    };
    setComentarioDelete(true);

    Swal.fire({
      title: "Cargando...",
      text: "Por favor, espere...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await comentariosDeleteTarea(data);

    if (response) {
      getListadoTareas("");
    }
    Swal.close();
    setComentarioDelete(false);
  };
  const getListadoTareas = async (titulo: string) => {
    if (!user || user.defaultPassword === 1) return;
    const resultado = await ObtenerTodasLasTareas(currentPage, titulo);
    if (resultado) {
      setTareas(resultado.tareas.data);
      setCurrentPage(resultado.tareas.current_page);
      setTotalPages(resultado.tareas.last_page);
    }
    setLoading(false);
  };

  const enviarComentarios = async (data: FieldValues, id: number) => {
    const recortarComentario = data[`comentario-${id}`].trim();
    const data2: comentario = {
      tarea_id: id,
      comentario: recortarComentario,
    };
    console.log(data2);
    if (data2.comentario === "" || !data2.tarea_id) return;

    Swal.fire({
      title: "Cargando...",
      text: "Por favor, espere...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await enviarComentariosTarea(data2);
    if (response) {
      getListadoTareas("");
      setValue(`comentario-${id}`, "");
    }
    Swal.close();
  };

  useEffect(() => {
    setLoading(true);
    getListadoTareas("");
  }, [currentPage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>LISTADO DE TAREAS</CardTitle>
        <CardDescription>
          En esta seccion podras ver tus tareas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full lg:w-auto mt-2">
          <Input
            onChange={(e) => {
              setValue("search2", e.target.value);
              if (e.target.value.length >= 2) {
                setLoading(true);
                getListadoTareas(e.target.value);
              } else {
                setLoading(true);
                getListadoTareas("");
              }
            }}
            value={watch("search2")}
            className="w-full lg:w-72"
            placeholder="Buscar por titulo"
          ></Input>
          <button
            onClick={() => {
              setLoading(true);
              setValue("search2", "");
              getListadoTareas("");
            }}
            className="underline"
          >
            Borrar Filtro
          </button>
        </div>
        <br></br>
        <div className="grid gap-4 ">
          {loading ? (
            <div className="flex gap-4 ">
              <ClipLoader color="#000" />
              <p className="text-gray-800">Cargando porfavor espere....</p>
            </div>
          ) : tareas.length > 0 ? (
            <div>
              {tareas.map((tarea: tarea) => (
                <div
                  key={tarea.id}
                  data-tarea-id={tarea.id}
                  className="flex flex-col mb-4 border rounded-lg p-4"
                >
                  <div className="flex justify-between mb-5">
                    <p className="font-bold">
                      Persona Asignada:{" "}
                      <span className="font-normal">{tarea.user.name}</span>
                    </p>

                    <p className="font-bold flex gap-2 items-center">
                      Estado:
                      <span
                        onContextMenu={(event) => {
                          if (
                            user.roles[0].name === "super-admin" ||
                            tarea.user_id === user.id
                          ) {
                            handleContextMenu(event, tarea.id, tarea.estado_id);
                          } else {
                            event.preventDefault();
                            toast.error(
                              "No tienes permisos para cambiar el estado de esta tarea"
                            );
                          }
                        }}
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
                  <Menu id={tarea.id}>
                    {Object.values(estadosTareas).map((estado, index) => {
                      return (
                        <Item
                          closeOnClick={false}
                          key={index + 1}
                          onClick={(event) => {
                            handleItemClick(event, index + 1);
                          }}
                        >
                          <div className="flex w-full justify-between items-center">
                            <p>{estado}</p>

                            {tarea.estado_id === index + 1 && (
                              <Check size={20} />
                            )}
                          </div>
                        </Item>
                      );
                    })}
                  </Menu>

                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">
                      <span className="font-bold text-xl">Titulo:</span>{" "}
                      {tarea.titulo}
                    </h3>
                    <div className="flex gap-4 items-center space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        onClick={() => {
                          if (commentsVisible.includes(tarea.id)) {
                            const buscando = commentsVisible.filter(
                              (id) => id !== tarea.id
                            );
                            setCommentsVisible(buscando);
                            return;
                          }
                          setCommentsVisible([
                            ...commentsVisible.filter((id) => id !== tarea.id),
                            tarea.id,
                          ]);
                        }}
                      >
                        <FaCommentDots size={20} />
                        {tarea.comentarios.length > 0 ? (
                          <span className="text-sm font-bold">
                            {tarea.comentarios.length}
                          </span>
                        ) : (
                          <p>0</p>
                        )}
                      </button>
                      <label
                        className="text-blue-500"
                        onClick={(e) => {
                          if (selectedFile.includes(tarea.id)) {
                            setSelectedFile(
                              selectedFile.filter((id) => id !== tarea.id)
                            );
                            return;
                          }
                          setSelectedFile([
                            ...selectedFile.filter((id) => id !== tarea.id),
                            tarea.id,
                          ]);
                        }}
                      >
                        <FaPaperclip
                          size={20}
                          className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        />
                        {tarea.archivos.length > 0 ? (
                          <span className="text-sm font-bold">
                            {tarea.archivos.length}
                          </span>
                        ) : (
                          <p>0</p>
                        )}
                      </label>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">
                    <span className="font-bold text-black">Descripcion: </span>
                    {tarea.descripcion}
                  </p>
                  <div className="flex w-full gap-x-4 flex-col lg:flex-row">
                    <div
                      className={`w-full ${
                        selectedFile.includes(tarea.id) ? "lg:w-6/12" : ""
                      } `}
                    >
                      {commentsVisible.includes(tarea.id) && (
                        <Card className="p-2 mt-5">
                          <p className="font-semibold ">Comentarios</p>
                          {tarea.comentarios.length > 0 ? (
                            tarea.comentarios.map((comentario, index) => (
                              <div
                                key={comentario.id}
                                className={`
                           ${
                             index + 1 !== tarea.comentarios.length &&
                             "border-b border-gray-200"
                           } 
                           pb-3 mt-1 flex gap-2 `}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <div className="flex gap-2">
                                    <p className="font-bold">
                                      {comentario.user.name}:
                                    </p>
                                    <p>{comentario.comentario}</p>
                                  </div>
                                  {
                                    // Implement comment deletion here
                                    user.id === comentario.user_id && (
                                      <DeleteIcon
                                        size={20}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDeleteComment(
                                            comentario.id,
                                            tarea.id
                                          );
                                        }}
                                        className={`hover:cursor-pointer  hover:text-red-700 ${
                                          comentarioDelete == true
                                            ? "text-gray-200 hover:text-gray-200"
                                            : ""
                                        } `}
                                        aria-disabled={comentarioDelete}
                                      ></DeleteIcon>
                                    )
                                  }
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="mt-4 text-gray-500 ">
                              No hay comentarios
                            </p>
                          )}

                          <div className="relative">
                            <Input
                              className="mt-2  w-[90%]  px-4 py-2 focus-within:border-gray-300 focus:border-gray-300 border-gray-300 border-2 border-solid rounded-md w-full"
                              placeholder="Comenta algo"
                              {...register(`comentario-${tarea.id}`, {})}
                              type="text"
                            />
                            <Send
                              size={20}
                              onClick={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                handleSubmit((e) => {
                                  enviarComentarios(e, tarea.id);
                                })(e); // Pass the event object to handleSubmit
                              }}
                              className="absolute z-50 right-4 top-3 text-blue-600 cursor-pointer"
                            />
                          </div>
                        </Card>
                      )}
                    </div>

                    <div
                      className={` ${
                        selectedFile.includes(tarea.id)
                          ? "w-full lg:w-6/12"
                          : ""
                      }  mt-5 `}
                    >
                      {selectedFile.includes(tarea.id) && (
                        <div className="flex flex-col lg:justify-between lg:items-start h-full">
                          {tarea.archivos.length > 0 ? (
                            tarea.archivos.map((archivo, index) => (
                              <div
                                key={index}
                                className={`flex w-full flex-col lg:flex-row gap-2 lg:items-center ${
                                  index + 1 === tarea.archivos.length
                                    ? ""
                                    : "border-b border-gray-200"
                                } pb-2 mt-2`}
                              >
                                <div className="flex flex-col w-full gap-1">
                                  <p className="font-semibold">
                                    {archivo.user.name},{" "}
                                    <span className="text-gray-700 font-medium">
                                      Adjunto:
                                    </span>{" "}
                                  </p>

                                  <div className="flex flex-row  justify-between gap-x-2 items-center">
                                    <a
                                      onClick={async (e) => {
                                        Swal.fire({
                                          title: "Cargando...",
                                          text: "Por favor, espere...",
                                          allowOutsideClick: false,
                                          showConfirmButton: false,
                                          willOpen: () => {
                                            Swal.showLoading();
                                          },
                                        });
                                        await downloadFile(archivo);
                                        Swal.close();
                                      }}
                                      className="text-blue-500 w-full overflow-hidden line-clamp-2  hover:cursor-pointer hover:text-blue-700"
                                    >
                                      {archivo.nombreOriginal}
                                    </a>

                                    {user.id === archivo.user_id ||
                                    tarea.user_id === user.id ||
                                    user.roles[0].name === "super-admin" ? (
                                      <DeleteIcon
                                        size={20}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDeleteArchivo(
                                            archivo.id,
                                            tarea.id
                                          );
                                        }}
                                        className={`hover:cursor-pointer hover:text-red-700 ${
                                          comentarioDelete == true
                                            ? "text-gray-200 hover:text-gray-200"
                                            : ""
                                        } `}
                                      ></DeleteIcon>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600 w-full  text-center font-medium">
                              No hay archivos...
                            </p>
                          )}

                          <div className="w-full overflow-hidden mt-5 ">
                            <label htmlFor={`file-upload-${tarea.id}`}>
                              <span className="flex gap-2 hover:cursor-pointer hover:text-blue-600">
                                <UploadCloud
                                  className="text-blue-500"
                                  size={20}
                                />
                                Subir Archivo
                              </span>
                              <input
                                id={`file-upload-${tarea.id}`}
                                type="file"
                                className="hidden w-auto mt-5 text-gray-600 "
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {tareas.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                ></Pagination>
              )}
            </div>
          ) : (
            <p>No hay tareas</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListadoTareas;
