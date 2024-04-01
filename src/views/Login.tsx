import { useState, CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import generateTitle from "@/utils/generateTitle";

import { UserType } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import useAuthContext from "@/hooks/useAuthContext";
import PropagateLoader from "react-spinners/PropagateLoader";
import { EyeIcon } from "lucide-react";
import { BiHide } from "react-icons/bi";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const Login = () => {
  generateTitle("Tareas - Login");

  let [loading, setLoading] = useState(false); //eslint-disable-line

  const [searchParams] = useSearchParams(); //eslint-disable-line

  const navigate = useNavigate();

  const [eye, setEye] = useState(false); //eslint-disable-line

  const { token, login: iniciarSesion } = useAuthContext(); //eslint-disable-line

  useEffect(() => {
    if (searchParams.get("user") && searchParams.get("password")) {
      setValue("password", searchParams.get("password") as string);
      const data: UserType = {
        email: searchParams.get("user") as string,
        password: searchParams.get("password") as string,
      };
      if (token) {
        navigate("/dashboard");
        return;
      }
      iniciarSesion(data);
    }
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    /* Validar los datos */
    if (!data.email || !data.password) {
      alert("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);

    const data2: UserType = {
      email: data.email,
      password: data.password,
    };

    await iniciarSesion(data2);

    setLoading(false);
  };
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar Sesion</h1>
        <p className="text-balance text-muted-foreground">
          Introduce tu correo y contraseña
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i,
            })}
            id="email"
            type="email"
            placeholder="m@example.com"
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
        <Link
          to={"/forgot-password"}
          className="ml-auto block text-sm underline"
        >
          Recuperar cuenta?
        </Link>
        <Button
          disabled={loading}
          onClick={handleSubmit(onSubmit)} //eslint-disable-line
          className="w-full bg-black text-white hover:bg-black"
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
