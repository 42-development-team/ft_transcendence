export type JwtPayload = {
    sub: number;
    login: string,
    twoFactorAuthenticated: boolean
  };
  // isTwoFAEnabled: boolean,
  // isFirstLogin: boolean,