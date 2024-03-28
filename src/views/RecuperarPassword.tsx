import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTareasContext } from "@/hooks/useTareasContext";
import generateTitle from "@/utils/generateTitle";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useState, CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};
const RecuperarPassword = () => {
  generateTitle("Tareas - Recuperar Password");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useTareasContext();
  const onSubmit = async (data: any) => {
    setLoading(true);
    const response = await forgotPassword(data.email);

    if (response) {
      setValue("email", "");
    }
    setLoading(false);
  };
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Recuperar Tu Cuenta</h1>
        <p className="text-balance text-muted-foreground">
          Te enviaremos un email para recuperar tu cuenta
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
          {errors.password?.type === "required" && (
            <p className="text-red-500">El email es obligatorio</p>
          )}
          {errors.email?.type === "pattern" && (
            <p className="text-red-500">El email no es valido</p>
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
        <Link to={"/"} className="ml-auto block text-sm underline">
          Iniciar Sesion?
        </Link>

        <Button
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-black text-white hover:bg-black"
        >
          Recuperar
        </Button>
      </div>
    </div>
  );
};

export default RecuperarPassword;
