import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "@/hooks/useAuthContext";
import { FormDataReset } from "@/types/types";
import generateTitle from "@/utils/generateTitle";
import PropagateLoader from "react-spinners/PropagateLoader";
import { BiHide } from "react-icons/bi";
import { EyeIcon } from "lucide-react";

const ValidarContraseñaPrimerIngreso = () => {
  generateTitle("Validar Contraseña");
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { logout, user, resetPassword, token, obteniendoUser } =
    useAuthContext();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [eye, setEye] = useState(false);
  const [eyeDos, setEyeDos] = useState(false);

  useEffect(() => {
    obteniendoUser();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.defaultPassword === 0) {
        navigate("/dashboard");
      }
    }
    if (!user && !token) {
      navigate("/");
    }
  }, [user]);

  const onSubmit = async (data: FormDataReset) => {
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
    setLoading(true);
    await resetPassword(dataFormated);
    setLoading(false);
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
            <Label htmlFor="password_temporal">Contraseña temporal</Label>
          </div>
          <Input
            onKeyUp={() => setError(false)}
            {...register("password_temporal", { required: true })}
            id="password_temporal"
            type="text"
            required
          />
          {errors.password_temporal?.type === "required" && (
            <p className="text-red-500">
              La contraseña temporal es obligatoria
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
          </div>

          <div className="relative">
            <Input
              onKeyUp={() => setError(false)}
              {...register("password", { required: true })}
              placeholder="***********"
              id="password"
              {...(eye ? { type: "text" } : { type: "password" })}
              required
            />
            {eye ? (
              <BiHide
                className="absolute top-2 right-2 cursor-pointer"
                size={20}
                onClick={() => setEye(!eye)}
              />
            ) : (
              <EyeIcon
                className="absolute top-2 right-2 cursor-pointer"
                size={20}
                onClick={() => setEye(!eye)}
              />
            )}
          </div>

          {errors.password?.type === "required" && (
            <p className="text-red-500">La contraseña es obligatoria</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
          </div>
          <div className="relative">
            <Input
              onKeyUp={() => setError(false)}
              {...register("password_confirmation", {
                required: true,
                minLength: 8,
              })}
              placeholder="***********"
              id="password_confirmation"
              {...(eyeDos ? { type: "text" } : { type: "password" })}
              required
            />

            {eyeDos ? (
              <BiHide
                className="absolute top-2 right-2 cursor-pointer"
                size={20}
                onClick={() => setEyeDos(!eyeDos)}
              />
            ) : (
              <EyeIcon
                className="absolute top-2 right-2 cursor-pointer"
                size={20}
                onClick={() => setEyeDos(!eyeDos)}
              />
            )}
          </div>

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
        {
          <PropagateLoader
            color="#36d7b7"
            loading={loading}
            cssOverride={{
              display: "block",
              margin: "0 auto",
            }}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          ></PropagateLoader>
        }
        <Button
          onClick={() => logout()}
          className="ml-auto inline-block text-sm underline"
        >
          Cerrar Sesion?
        </Button>
        <Button
          disabled={loading}
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
