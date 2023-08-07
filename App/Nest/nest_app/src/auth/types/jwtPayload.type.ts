export type JwtPayload = {
    sub: number;
    login: string;
    twoFactorAuthenticated: boolean;
    // imageUrl?: string;
  };
  // isTwoFAEnabled: boolean,
  // isFirstLogin: boolean,