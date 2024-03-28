import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FormDataReset } from "@/types/types";
import { CSSProperties, useEffect, useState } from "react";
import useAuthContext from "@/hooks/useAuthContext";
import generateTitle from "@/utils/generateTitle";
import { useSearchParams } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useTareasContext } from "@/hooks/useTareasContext";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "lucide-react";
import { BiHide } from "react-icons/bi";
const RecuperarPasswordToken = () => {
  generateTitle("Tareas - Recuperar Password");

  const [searchParams, setSearchParams] = useSearchParams();
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
  };
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const { logout, user,token } = useAuthContext();
  const { resetPassword } = useTareasContext();
  const [eye, setEye] = useState(false);
  const [eyeDos, setEyeDos] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("token") === null) {
      logout();
    }

    if(token){
      navigate('/dashboard')
    }
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FormDataReset) => {
    if (data.password !== data.password_confirmation) {
      setError(true);
      return;
    }

    setError(false);

    const dataFormated = {
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      token: searchParams.get("token"),
    };

    setLoading(true);
    const response = await resetPassword(dataFormated);
    if (response) {
      navigate("/");
    }
    setLoading(false);
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
            value={watch("email")}
            placeholder="Tu email de registro"
            id="email"
            type="email"
            required
          />
          {errors.email?.type === "required" && (
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
            cssOverride={override}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        }
        <Link to={"/"} className="ml-auto inline-block text-sm underline">
          Regresar a la pagina de inicio?
        </Link>
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

export default RecuperarPasswordToken;
