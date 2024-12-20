export interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ISignUpDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ISignInDetails {
  email: string;
  password: string;
}
