export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum UserMaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
}

export interface IUser {
  id: string;
  email: string;
  isAdmin: boolean;
  verified: boolean;
  nationality: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  gender: UserGender;
  dateOfBirth: string;
  maritalStatus: UserMaritalStatus;
  createdAt: string;
  updatedAt: string;
}
