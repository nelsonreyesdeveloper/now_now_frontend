import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AsyncSelect from "react-select/async";
import { useTareasContext } from "@/hooks/useTareasContext";
import { useForm } from "react-hook-form";

const NuevaTarea = () => {
  const { token, user, obteniendoUser } = useAuth();

  const [users, setUsers] = useState([]);

  const {
    ObtenerTodosLosUsuarios,
    ObtenerTodosLosUsuariosPorSearch,
    nuevaTareaPost,
  } = useTareasContext();
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
    const resultado = await nuevaTareaPost(dataFormated);
    if (resultado) {
      setValue("titulo", "");
      setValue("descripcion", "");
      setValue("user", "");

      ObtenerTodosLosUsuariosData();
    }
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
          <p className="mt-3"> En esta seccion podras ver tus tareas.</p>
        </CardDescription>

        <div className="my-10">
          <div className="grid lg:grid-cols-3 lg:gap-2">
            <div className="col-span-1">
              <Label>Titulo</Label>
              <Input
                {...register("titulo", { required: true })}
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Nombre de la tarea"
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />

              {errors.email?.type === "required" && (
                <p className="text-red-500">El email es obligatorio</p>
              )}
              {
                errors.nombreDeLaTarea?.type === "required" && (
                  <p className="text-red-500">Este campo es requerido</p>
                ) // eslint-disable-line
              }
            </div>

            <div className="col-span-1">
              <Label>Asignar a : </Label>
              <AsyncSelect
                {...register("user", { required: true })}
                className="border border-gray-300 rounded  w-full"
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
              <textarea
                {...register("descripcion", { required: true })}
                className="border border-gray-300 rounded px-4 py-2 w-full"
                placeholder="En esta tarea..."
              />
              {
                errors.descripcion?.type === "required" && (
                  <p className="text-red-500">Este campo es requerido</p>
                ) // eslint-disable-line
              }
            </div>
          </div>
          <div className="mt-0">
            <button
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-600 text-white  p-3 w-full  mt-5 lg:mt-0 lg:w-auto"
            >
              Guardar
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default NuevaTarea;
