import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTareasContext } from "@/hooks/useTareasContext";
const RecuperarPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { forgotPassword } = useTareasContext();
  const onSubmit = (data: any) => {
    forgotPassword(data.email);
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
        <Link to={"/"} className="ml-auto inline-block text-sm underline">
          Iniciar Sesion?
        </Link>

        <Button
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
