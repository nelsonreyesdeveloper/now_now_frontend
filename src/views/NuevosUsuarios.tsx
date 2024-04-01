import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTareasContext } from "@/hooks/useTareasContext";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";

const NuevosUsuarios = () => {
  const { nuevoUsuarioPost } = useTareasContext();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const dataFormated = {
      email: data.email,
      name: data.name,
      "tipo-rol": data.userType.value,
    };
    setLoading(true);
    const response = await nuevoUsuarioPost(dataFormated);
    if (response) {
      setValue("email", "");
      setValue("name", "");
      setValue("userType", "");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> CREA UN NUEVO USUARIO </CardTitle>

        <CardDescription>
          En esta seccion podras registrar usuarios nuevos{" "}
        </CardDescription>

        <div className="flex flex-col items-center ">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid lg:grid-cols-3 lg:gap-3 mt-5 ">
              <div className="mb-4">
                <Label htmlFor="email" className="block mb-2">
                  Correo:
                </Label>
                <Input
                  placeholder="correo@correo.com"
                  type="email"
                  id="email"
                  {...register("email", { required: true })}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500">El email es obligatorio</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="name" className="block mb-2">
                  Nombre:
                </Label>
                <Input
                  placeholder="Nombre del usuario"
                  type="text"
                  id="name"
                  {...register("name", { required: true })}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500">El nombre es obligatorio</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="userType" className="block mb-2">
                  Tipo de usuario:
                </Label>
                <AsyncSelect
                  id="userType"
                  {...register("userType", { required: true })}
                  // className="border border-gray-300 rounded px-4 py-2 w-full"
                  classNamePrefix="select"
                  onChange={(e) => setValue("userType", e)}
                  placeholder="Selecciona un tipo de usuario"
                  defaultOptions={[
                    { value: "1", label: "Super Usuario" },
                    { value: "2", label: "Empleado" },
                  ]}
                ></AsyncSelect>
                {errors.userType?.type === "required" && (
                  <p className="text-red-500">
                    El tipo de usuario es obligatorio
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                disabled={loading}
                type="submit"
                className="bg-blue-600 text-white  p-3 w-full  mt-5 lg:mt-0 lg:w-auto"
              >
                Crear usuario
              </button>
              <CircleLoader
                color="#000"
                loading={loading}
                size={40}
                aria-label="Loading Spinner"
                data-testid="loader"
              ></CircleLoader>
            </div>
          </form>
        </div>
      </CardHeader>
    </Card>
  );
};

export default NuevosUsuarios;
