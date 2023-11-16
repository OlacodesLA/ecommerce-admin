export interface IRegistrationValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password2: string;
}
export interface ILoginValues {
  email: string;
  password: string;
}
export interface IForgotValues {
  email: string;
}

export interface IResetValues {
  newPassword: string;
}
