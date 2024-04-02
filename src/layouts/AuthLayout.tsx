import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import image from "../assets/img/full-stack-developer-programacion.jpg";

import "react-toastify/dist/ReactToastify.css";
export function AuthLayout() {
  return (
    <div className="w-full sm:w-11/12 lg:max-w-7xl mx-auto mt-0 lg:mt-10 lg:mb-10 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
        <img
          className=" h-[100%] w-full object-cover dark:brightness-[0.2] dark:grayscale"
          src={image}
          alt=""
        />
      </div>
      <div className="flex  items-center  justify-center mt-10 lg:mt-0 ">
        <Outlet></Outlet>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
