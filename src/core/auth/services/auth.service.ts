export type LoginInput = {
  email: string;
  password: string;
};

type ReturnLogin = {
  id: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
};

export type LoginOutput = {
  client: ReturnLogin;
};

export type LoginPayload = {
  id: string;
};

export type CookieOptions = {
  maxAge: number;
  httpOnly: boolean;
};

export type SetCookie = (
  name: string,
  val: string,
  options: CookieOptions,
) => void;

export interface AuthService {
  login(loginInput: LoginInput, setCookie: SetCookie): Promise<LoginOutput>;
}
