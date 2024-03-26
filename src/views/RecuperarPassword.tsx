import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const RecuperarPassword = () => {
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
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <Link
          to={"/"}
          className="ml-auto inline-block text-sm underline"
        >
          Iniciar Sesion?
        </Link>

        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-black"
        >
          Recuperar
        </Button>
      </div>
    </div>
  );
};

export default RecuperarPassword;
