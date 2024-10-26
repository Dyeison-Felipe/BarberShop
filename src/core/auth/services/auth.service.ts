export type LoginInput = {
  email: string;
  password: string;
}

type ReturnLogin = {
  id: string;
  name: string;
  email:string;
  phoneNumber: string;
  photoUrl: string;
}

export type LoginOutput = {
  token: string;
  client: ReturnLogin;
}

export type LoginPayload = {
  id: string;
}



export interface AuthService {
  login(loginInput: LoginInput):Promise <LoginOutput>;
}