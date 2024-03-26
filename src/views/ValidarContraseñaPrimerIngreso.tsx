import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

type FormData = {
  password: string;
  password_confirmation: string;
};

const ValidarContraseñaPrimerIngreso = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { Logout } = useAuth();

  const [error, setError] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      if (user.defaultPassword === 0) {
        navigate("/dashboard");
      }
    }
  }, []);

  const onSubmit = (data: FormData) => {
    if (data.password !== data.password_confirmation) {
      setError(true);
      return;
    }

    setError(false);
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Hola! {user?.name}</h1>
        <p className="text-balance text-muted-foreground">
          Estas autenticado sin embargo debes establecer tu contraseña, ya que
          la actual es por defecto.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
          </div>
          <Input
            onKeyUp={() => setError(false)}
            {...register("password", { required: true })}
            placeholder="***********"
            id="password"
            type="password"
            required
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">La contraseña es obligatoria</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Confirmar contraseña</Label>
          </div>
          <Input
            onKeyUp={() => setError(false)}
            {...register("password_confirmation", {
              required: true,
              minLength: 8,
            })}
            placeholder="***********"
            id="password_confirmation"
            type="password"
            required
          />
          {errors.password_confirmation?.type === "required" && (
            <p className="text-red-500">
              Las contraseñas de confirmacion es obligatoria
            </p>
          )}
          {errors.password_confirmation?.type === "minLength" && (
            <p className="text-red-500">
              La contraseña debe tener al menos 8 caracteres
            </p>
          )}
          {error && (
            <p className="text-red-500">Las contraseñas no coinciden</p>
          )}
        </div>
        <Button
          onClick={() => Logout()}
          className="ml-auto inline-block text-sm underline"
        >
          Cerrar Sesion?
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-black text-white hover:bg-black"
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default ValidarContraseñaPrimerIngreso;
