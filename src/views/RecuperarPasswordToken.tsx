import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTareasContext } from "@/hooks/useTareasContext";
import { FormDataReset } from "@/types/types";
import { useState } from "react";
import useAuthContext from "@/hooks/useAuthContext";
const RecuperarPasswordToken = () => {
  const [error, setError] = useState(false);

  const { logout, user } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: FormDataReset) => {
    if (data.password !== data.password_confirmation) {
      setError(true);
      return;
    }

    setError(false);

    const dataFormated = {
      email: user.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      password_temporal: data.password_temporal,
    };

    // resetPassword(dataFormated);
  };
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">
          Hola debes Ingresar una nueva contraseña para restablecer tu cuenta
        </h1>
        <p className="text-balance text-muted-foreground">
          Por favor ingresa tu nueva contraseña
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="email">Email</Label>
          </div>
          <Input
            onKeyUp={() => setError(false)}
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i,
            })}
            placeholder="Tu email de registro"
            id="email"
            type="email"
            required
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">El email es obligatorio</p>
          )}
          {errors.email?.type === "pattern" && (
            <p className="text-red-500">El email no es valido</p>
          )}
        </div>
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
            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
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
        <Link to={"/"} className="ml-auto inline-block text-sm underline">
          Regresar a la pagina de inicio?
        </Link>
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

export default RecuperarPasswordToken;
