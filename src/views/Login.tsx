import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Login = () => {
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
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
          </div>
          <Input
            placeholder="***********"
            id="password"
            type="password"
            required
          />
        </div>
        <Link
          to={"/forgot-password"}
          className="ml-auto inline-block text-sm underline"
        >
          Recuperar cuenta?
        </Link>
        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-black"
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;