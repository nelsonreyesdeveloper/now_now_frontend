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
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import CircleLoader from "react-spinners/CircleLoader";

const NuevaTarea = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const {
    ObtenerTodosLosUsuarios,
    ObtenerTodosLosUsuariosPorSearch,
    nuevaTareaPost,
  } = useTareasContext();

  const ObtenerTodosLosUsuariosData = async () => {
    const data = await ObtenerTodosLosUsuarios();
    setUsers(data);
  };

  const onSubmit = async (data) => {
    console.log(data);

    const dataFormated = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      user_id: data.user.value,
    };
    setLoading(true);
    const resultado = await nuevaTareaPost(dataFormated);
    if (resultado) {
      setValue("titulo", "");
      setValue("descripcion", "");
      setValue("user", "");
      await ObtenerTodosLosUsuariosData();
    }
    setLoading(false);
  };

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
    <Card>
      <CardHeader>
        <CardTitle>NUEVA TAREA</CardTitle>
        <CardDescription>
          En esta seccion podras crear nuevas tareas.
        </CardDescription>

        <div className="my-10">
          <div className="grid lg:grid-cols-3 lg:gap-2">
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
          <div className="mt-0 flex gap-4">
            <button
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-600 text-white  p-3 w-full  mt-5 lg:mt-0 lg:w-auto"
            >
              Guardar
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
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default NuevaTarea;
