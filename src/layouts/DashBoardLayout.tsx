import { CircleUser, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, Outlet } from "react-router-dom"; //eslint-disable-line
import { useEffect } from "react";
import generateTitle from "@/utils/generateTitle";
import useAuth from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export function Dashboard() {
  generateTitle("Tareas - Dashboard");

  const { token, logout, user, obteniendoUser } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (user !== undefined) {
      if (Object.keys(user).length > 0) {
        if (user.defaultPassword === 1) {
          navigate("/primer-ingreso");
        }
        if (
          user.roles[0].name !== "super-admin" &&
          user.defaultPassword === 0
        ) {
          navigate("/dashboard");
        }
      }
    }
  }, [user]); //eslint-disable-line

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate("/");
      } else {
        const response = await obteniendoUser();

        if (response === false) {
          navigate("/");
        }
      }
    };

    fetchUser();
  }, [token]); //eslint-disable-line

  const { pathname } = useLocation();

  const onClickLogout = async () => {
    logout();
  };

  if (user === undefined) return null;

  if (Object.keys(user).length === 0) return null;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky bg-white  top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden  flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to={"/dashboard"}
            // href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white" side="top">
            <nav className="grid bg-gray-200 p-2 rounded-sm gap-6 text-lg font-medium">
              <Link
                to={""}
                className="text-muted-foreground font-bold transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={onClickLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] h-vh-100  flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">MENU</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid  gap-4 text-sm text-muted-foreground">
            <Link
              to={"/dashboard"}
              className={pathname === "/dashboard" ? "font-bold" : ""}
            >
              TAREAS ASIGNADAS
            </Link>

            {user.roles[0]["name"] === "super-admin" && (
              <Link
                className={
                  pathname === "/dashboard/nueva-tarea" ? "font-bold" : ""
                }
                to={"/dashboard/nueva-tarea"}
              >
                AÑADIR NUEVAS TAREAS
              </Link>
            )}
            {user.roles[0]["name"] === "super-admin" && (
              <Link
                className={
                  pathname === "/dashboard/nuevos-usuarios" ? "font-bold" : ""
                }
                to={"/dashboard/nuevos-usuarios"}
              >
                AÑADIR NUEVOS USUARIOS
              </Link>
            )}
          </nav>
          <div className="grid gap-2">
            <div className="flex justify-between mb-5">
              <p className="font-bold text-xl uppercase">
                Bienvenido:{" "}
                <span className="capitalize font-normal">{user.name}</span>
              </p>
              <p className="text-gray-500 mt-2">
                Tus permisos son:{" "}
                <span className="capitalize font-normal">
                  {user.roles.map((role) => {
                    return (
                      <span
                        key={role.id}
                        className="text-sm underline text-black font-normal capitalize"
                      >
                        {role.name}
                      </span>
                    );
                  })}
                </span>
              </p>
            </div>

            <Outlet></Outlet>
          </div>
        </div>
      </main>
      <ToastContainer></ToastContainer>
    </div>
  );
}
