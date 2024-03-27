import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import generateTitle from "@/utils/generateTitle";

import { UserType } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import useAuthContext from "@/hooks/useAuthContext";
const Login = () => {
  generateTitle("Tareas - Login");

  const [searchParams, setSearchParams] = useSearchParams(); //eslint-disable-line

  const navigate = useNavigate();

  const { token, setToken, login: iniciarSesion } = useAuthContext(); //eslint-disable-line

  useEffect(() => {
    if (searchParams.get("user") && searchParams.get("password")) {
      localStorage.setItem(
        "temporal",
        JSON.stringify(searchParams.get("password"))
      );
      const data: UserType = {
        email: searchParams.get("user") as string,
        password: searchParams.get("password") as string,
      };
      console.log(data);
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
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: UserType) => {
    /* Validar los datos */
    if (!data.email || !data.password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    iniciarSesion(data);
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
            {...register("email", { required: true })}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          {errors.email?.type === "required" && (
            <p className="text-red-500">El email es obligatorio</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
          </div>
          <Input
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
        <Link
          to={"/forgot-password"}
          className="ml-auto inline-block text-sm underline"
        >
          Recuperar cuenta?
        </Link>
        <Button
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
