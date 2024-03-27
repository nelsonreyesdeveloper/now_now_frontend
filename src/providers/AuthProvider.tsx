import React, { createContext, useState, useEffect } from "react";
import { FormDataReset } from "@/types/types";

import { User } from "@/types/types";
import { toast } from "react-toastify";
interface AuthContextProps {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  obteniendoUser: () => Promise<void>;
  resetPassword: (data: FormDataReset) => Promise<void>;
  // Add other auth-related functions as needed
}

interface LoginCredentials {
  // Define the LoginCredentials interface based on your login data
  email: string;
  password: string;
  // Add other login credentials as needed
}

export const AuthContext = createContext<AuthContextProps>({
  user: {} as User,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  login: async () => {},
  logout: () => {},
  token: null,
  obteniendoUser: async () => {},
  resetPassword: async () => {},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tokenLocalStorage = localStorage.getItem("authToken");
  const [token, setToken] = useState<string | null>(tokenLocalStorage);
  // Fetch initial authentication state from local storage (optional)
  useEffect(() => {
    if (token) {
      // Implement logic to validate token and set user/isAuthenticated state
      // (e.g., API call to verify token and fetch user data)
      setIsAuthenticated(true);
      // Update user state based on retrieved data
    }
  }, []);

  const logout = () => {
    console.log(token);
    try {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };
  // Implement functions for updating context values as needed
  const login = async (credentials: LoginCredentials) => {
    // Handle login logic (API call, data validation, etc.)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Update user state with data from response
        localStorage.setItem("authToken", data.access_token); // Store token for future use
        setToken(data.access_token);
        setIsAuthenticated(true);
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle login errors gracefully (display error message, etc.)
    }
  };

  /* reset password tiene que llevar el email, el password y password_confirmation */

  const resetPassword = async (data: FormDataReset) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        obteniendoUser();
      } else {
        console.error("Error al resetear la contraseña");
      }
    } catch (error) {
      console.error("Error al resetear la contraseña");
    }
  };

  const obteniendoUser = async () => {
    /* ir a api/user y obtener el user */
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Error al obtener el usuario");
      }
    } catch (error) {
      console.error("Error al obtener el usuario");
    }
  };

  // Add other auth-related functions as needed

  const value: AuthContextProps = {
    user,
    isAuthenticated,
    login,
    logout,
    token,
    obteniendoUser,
    resetPassword,
    // Add other functions for managing auth state
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
