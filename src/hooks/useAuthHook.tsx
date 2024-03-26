import { UserType } from "@/types/types";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();
  /* Verificar si el token está presente para determinar si el usuario está autenticado */
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const Login = async (data: UserType) => {
    /* Envia los datos */
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        const { message } = await response.json();
        console.log(message);
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Logout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        }
      );
      console.log(response);
      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setIsAuthenticated(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PrimerIngreso = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Verificar si el token está presente para determinar si el usuario está autenticado
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  return {
    Login,
    token,
    setToken,
    isAuthenticated,
    user,
    Logout,
  };
};

export default useAuth;
