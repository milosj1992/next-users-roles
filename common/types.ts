export interface Role {
  id: number;
  role_name: string;
  short_description: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: "Admin" | "User" | "Guest";
  created_at: Date;
}

export interface RoleFormValues {
  role_name: string;
  short_description: string;
}
export interface UserFormValues {
  first_name: string;
  last_name: string;
  role_name: string;
  email: string;
}
