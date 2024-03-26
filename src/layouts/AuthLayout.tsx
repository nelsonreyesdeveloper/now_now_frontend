
import {  Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="w-full sm:w-11/12 lg:max-w-7xl mx-auto mt-0 lg:mt-10 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex  items-center  justify-center py-12">
        <Outlet></Outlet>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          src="src/assets/full-stack-developer-programacion.jpg"
          alt=""
        />
        {/* <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
