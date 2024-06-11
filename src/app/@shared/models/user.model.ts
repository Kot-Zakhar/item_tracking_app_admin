export const enum Role {
  SimpleUser = 1,
  Manager = 2,
  Admin = 3,
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roleIds?: Role[] | null;
  avatar?: string;
}

export interface UserWithDetails {
  user: User;
  itemsAmount: number;
}