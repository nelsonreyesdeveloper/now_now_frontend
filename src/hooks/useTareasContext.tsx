import { TareasContext } from "@/providers/TareasProvider";
import { useContext } from "react";

export const useTareasContext = () => {
  const context = useContext(TareasContext);

  if (!context) {
    throw new Error(
      "useTareasContext debe ser usado dentro de un TareasProvider"
    );
  }

  return context;
};
