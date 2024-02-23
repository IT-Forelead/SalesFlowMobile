export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginData = {
  login: string;
  password: string;
};

export type JwtData = {
  exp: number;
  iat: number;
  id: string;
  marketId: string;
  firstname: string;
  lastname: string;
  privileges: string[];
  login: string;
  phone: string;
};
