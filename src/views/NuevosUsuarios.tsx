import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthContext from "@/hooks/useAuthContext";
import { useTareasContext } from "@/hooks/useTareasContext";
import React from "react";
import { useForm } from "react-hook-form";

const NuevosUsuarios = () => {
  const { nuevoUsuarioPost } = useTareasContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const dataFormated = {
      email: data.email,
      name: data.name,
      "tipo-rol": data.userType,
    };

    nuevoUsuarioPost(dataFormated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> CREA UN NUEVO USUARIO </CardTitle>

        <CardDescription >En esta seccion podras registrar usuarios nuevos </CardDescription>

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
                <select
                  id="userType"
                  {...register("userType", { required: true })}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                >
                  <option value="">Seleccione un tipo de usuario</option>
                  <option value="1">Super Usuario</option>
                  <option value="2">Empleado</option>
                </select>
                {errors.userType?.type === "required" && (
                  <p className="text-red-500">
                    El tipo de usuario es obligatorio
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              Crear usuario
            </button>
          </form>
        </div>
      </CardHeader>
    </Card>
  );
};

export default NuevosUsuarios;
