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
