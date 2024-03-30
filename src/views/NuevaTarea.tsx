import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { Input, Tex } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AsyncSelect from "react-select/async";
import { useTareasContext } from "@/hooks/useTareasContext";
import { set, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import CircleLoader from "react-spinners/CircleLoader";
import useAuthContext from "@/hooks/useAuthContext";
import { estadosTareas } from "../data/estados";
import { Item, Menu, Submenu, useContextMenu } from "react-contexify";
import Swal from "sweetalert2";
import {
  Check,
  DeleteIcon,
  Edit2Icon,
  ShieldCloseIcon,
  SidebarCloseIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";

const NuevaTarea = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);
  const [updateArray, setUpdateArray] = useState({});
  const [tareas, setTareas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const { user } = useAuthContext();
  const {
    ObtenerTodosLosUsuarios,
    ObtenerTodosLosUsuariosPorSearch,
    nuevaTareaPost,
    ObtenerTodasLasTareas,
    changueStatusTarea,
    deleteTarea,
    editarTareaPath,
  } = useTareasContext();
  const { show } = useContextMenu({});

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeleteTarea = async (tarea) => {
    Swal.fire({
      title: `¿Estas seguro que desea eliminar la tarea : ${tarea.titulo} ?`,
      text: "No podras revertir esta accion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Cargando...",
          text: "Por favor, espere...",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await deleteTarea(tarea.id);
        if (response) {
          await getListadoTareas();
        }
        Swal.close();
      }
    });
  };

  useEffect(() => {
    Modal.setAppElement("body");
  }, [updateArray]);
  function handleContextMenu(event, tareaId, estado) {
    show({
      id: tareaId,
      event,
      position: { x: event.clientX - 250, y: event.clientY },
      props: { tarea: tareaId, estado: estado },
    });
  }

  const handleItemClick = async ({ id, event, props }, estado) => {
    const data = {
      tarea_id: props.tarea,
      estado_id: estado,
    };

    const response = await changueStatusTarea(data);

    if (response) {
      getListadoTareas();
    }
  };
  const ObtenerTodosLosUsuariosData = async () => {
    const data = await ObtenerTodosLosUsuarios();
    setUsers(data);
  };

  const onSubmit = async (data) => {
    const dataFormated = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      user_id: data.user.value,
    };
    setLoading(true);

    const resultado =
      Object.values(updateArray).length > 0
        ? await editarTareaPath(dataFormated, updateArray.id)
        : await nuevaTareaPost(dataFormated);
    if (resultado) {
      setValue("titulo", "");
      setValue("descripcion", "");
      setValue("user", "");
      await getListadoTareas();
    }
    setLoading(false);

    if (Object.values(updateArray).length > 0) {
      closeModal();
    }
  };

  const getListadoTareas = async (titulo) => {
    if (!user || user.defaultPassword === 1) return;
    const resultado = await ObtenerTodasLasTareas(currentPage, titulo);
    if (resultado) {
      setTareas(resultado.tareas.data);
      setCurrentPage(resultado.tareas.current_page);
      setTotalPages(resultado.tareas.last_page);
    }
    setLoadingTask(false);
  };

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setUpdateArray({});
    setValue("titulo", "");
    setValue("descripcion", "");
    setValue("user", "");
    setIsOpen(false);
  }

  useEffect(() => {
    setLoadingTask(true);
    getListadoTareas();
  }, [currentPage]);

  useEffect(() => {
    ObtenerTodosLosUsuariosData();
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  return (
    <Card className="w-full overflow-x-auto">
      <CardHeader>
        <CardTitle>NUEVA TAREA</CardTitle>
        <CardDescription>
          En esta seccion podras crear nuevas tareas.
        </CardDescription>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
          <Button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm w-full lg:max-w-max"
          >
            Nueva Tarea
          </Button>
          <div className="w-full lg:w-auto">
            <Input
              onChange={(e) => {
                setValue("search", e.target.value);
                if (e.target.value.length >= 2) {
                  setLoadingTask(true);
                  getListadoTareas(e.target.value);
                } else {
                  setLoadingTask(true);
                  getListadoTareas();
                }
              }}
              // {...register("search")}
              className="w-full lg:w-72"
              placeholder="Buscar por titulo"
            ></Input>
            <button
              onClick={() => {
                setLoadingTask(true);
                setValue("search", "");
                getListadoTareas();
              }}
              className="underline"
            >
              Borrar Filtro
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loadingTask ? (
          <div className="flex justify-center items-center gap-3">
            <CircleLoader
              color="#000"
              loading={loadingTask}
              size={40}
              aria-label="Loading Spinner"
              data-testid="loader"
            ></CircleLoader>
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : (
          <>
            {tareas.length > 0 ? (
              <div className="w-full ">
                <div className=" w-full overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Titulo
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Descripcion
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Estado
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Usuario Asignado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tareas.map((tarea) => (
                        <>
                          <tr
                            key={tarea.id}
                            onContextMenu={(event) => {
                              if (
                                user.roles[0].name === "super-admin" ||
                                tarea.user_id === user.id
                              ) {
                                handleContextMenu(
                                  event,
                                  tarea.id,
                                  tarea.estado_id
                                );
                              } else {
                                event.preventDefault();
                                toast.error(
                                  "No tienes permisos para cambiar el estado de esta tarea"
                                );
                              }
                            }}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          >
                            <td className="px-6 py-4">{tarea.id}</td>
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {tarea.titulo}
                            </th>
                            <td className="px-6 py-4">{tarea.descripcion}</td>
                            <td className="px-6 py-4">
                              {Object.keys(estadosTareas).map((estado, key) => {
                                {
                                  if (key + 1 === tarea.estado_id) {
                                    return (
                                      <span
                                        key={key + 1}
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                                      >
                                        {estado}
                                      </span>
                                    );
                                  }
                                }
                              })}
                            </td>
                            <td className="px-6 py-4">{tarea.user.name}</td>
                          </tr>
                          <Menu id={tarea.id}>
                            <Submenu label="Cambiar de estado Tarea" arrow="🦄">
                              {Object.values(estadosTareas).map(
                                (estado, index) => {
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
                                }
                              )}
                            </Submenu>

                            <Item
                              onClick={() => {
                                handleDeleteTarea(tarea);
                              }}
                            >
                              <div className="flex w-full justify-between items-center">
                                <p>Eliminar Tarea</p>
                                <div>
                                  <DeleteIcon size={20} />
                                </div>
                              </div>
                            </Item>

                            <Item
                              onClick={() => {
                                setUpdateArray(tarea);

                                setValue("titulo", tarea.titulo);
                                setValue("descripcion", tarea.descripcion);
                                setValue("user", {
                                  value: tarea.user_id,
                                  label: tarea.user.name,
                                });
                                openModal();
                              }}
                            >
                              <div className="flex w-full justify-between items-center">
                                <p>Editar Tarea</p>
                                <div>
                                  <Edit2Icon size={20} />
                                </div>
                              </div>
                            </Item>
                          </Menu>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
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
          </>
        )}
      </CardContent>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        // style={customStyles}
        contentLabel="Nueva Tarea"
        className="w-11/12 mx-auto translate-y-[20%] translate-x-[4%]   bg-white   lg:translate-y-[20%] lg:translate-x-[50%] border border-gray-300 absolute  p-3 rounded-lg lg:w-1/2 lg:mx-auto"
      >
        <div className="relative">
          <h2 className="text-center font-semibold uppercase">
            {Object.values(updateArray).length > 0
              ? "Editar Tarea"
              : "Nueva Tarea"}
          </h2>
          <button
            disabled={loading}
            className="absolute bg-red-700 text-white px-3 py-1 font-bold right-0 -top-2 hover:bg-red-800 hover:cursor-pointer"
            onClick={closeModal}
          >
            X
          </button>
        </div>

        <div className="my-5">
          <Card className="mb-5">
            <CardContent className="p-2 lg:p-6">
              <div className="grid lg:grid-cols-2 lg:gap-2">
                <div className="col-span-1">
                  <Label>Titulo</Label>
                  <Input
                    {...register("titulo", { required: true })}
                    type="text"
                    id="titulo"
                    value={watch("titulo")}
                    name="titulo"
                    placeholder="Nombre de la tarea"
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                  />

                  {errors.titulo?.type === "required" && (
                    <p className="text-red-500">El titulo es obligatorio</p>
                  )}
                </div>

                <div className="col-span-1">
                  <Label>Asignar a : </Label>
                  <AsyncSelect
                    placeholder="Selecciona un usuario"
                    {...register("user", { required: true })}
                    className=""
                    value={watch("user")}
                    onChange={(e) => setValue("user", e)}
                    cacheOptions
                    /* quiero mandar a llamar de forma asincronica */
                    loadOptions={(inputValue) =>
                      ObtenerTodosLosUsuariosPorSearch(inputValue)
                    }
                    defaultOptions={users}
                  ></AsyncSelect>
                  {errors.user?.type == "required" && (
                    <p className="text-red-500">Este campo es requerido</p>
                  )}
                </div>
                <div className="col-span-1">
                  <Label>Descripcion</Label>
                  <Textarea
                    {...register("descripcion", { required: true })}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    placeholder="En esta tarea..."
                    value={watch("descripcion")}
                  />
                  {
                    errors.descripcion?.type === "required" && (
                      <p className="text-red-500">Este campo es requerido</p>
                    ) // eslint-disable-line
                  }
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-0 flex gap-4">
            <button
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-600 text-white  p-3 w-full  mt-5 lg:mt-0 lg:w-auto"
            >
              {Object.values(updateArray).length > 0
                ? "Editar Tarea"
                : "Crear Tarea"}
            </button>

            <CircleLoader
              color="#000"
              loading={loading}
              size={40}
              aria-label="Loading Spinner"
              data-testid="loader"
            ></CircleLoader>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default NuevaTarea;
