export type UserType = {
  email: string;
  password: string;
};

export type FormDataReset = UserType & {
  password_confirmation: string;
  password_temporal: string;
};
export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  defaultPassword: number;
  roles: [
    {
      id: number;
      name: string;
      guard_name: string;
      created_at: string;
      updated_at: string;
      pivot: {
        model_type: string;
        model_id: number;
        role_id: number;
      };
    }
  ];
};
export type Pagination = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

export type nuevoUsuarioPostData = {
  email: string;
  name: string;
  "tipo-rol": string;
};

export type resetPaswordData = {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
};

export type comentarioDelete = {
  comentario_id: number;
  tarea_id: number;
};

export type archivodelete = {
  archivo_id: number;
  tarea_id: number;
};

export type tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  estado_id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  user: User;
  comentarios: [
    {
      id: number;
      comentario: string;
      user_id: number;
      tarea_id: number;
      created_at: string;
      updated_at: string;
      user: User;
    }
  ];
  archivos: [
    {
      id: number;
      nombreOriginal: string;
      ruta: string;
      tarea_id: number;
      created_at: string;
      updated_at: string;
      user: User;
      user_id: number;
    }
  ];
};

export type generarReporte = {
  fecha_inicio: string;
  fecha_fin: string;
};

export type generarReportePDF = {
  titulo: string;
  descripcion: string;
  estado: string;
  tiempo: string;
  usuario: string;
};

export type editarTareaPost = {
  titulo: string;
  descripcion: string;
  user: {
    value: number;
  };
};

export type editarTareaPostSinObjeto = {
  titulo: string;
  descripcion: string;
  user_id: number;
};

export type updateStatusTarea = {
  estado_id: number;
  tarea_id: number;
};

export type tareaConpaginacion = {
  success: boolean;
  tareas: {
    current_page: number;
    last_page: number;
    data: [];
  };
};

export type comentarioPost = {
  tarea_id: number;
  comentario: string;
};

export type archivo = {
  id: number;
  nombreOriginal: string;
  ruta: string;
  tarea_id: number;
  created_at: string;
  updated_at: string;
  user: User;
  user_id: number;
};
