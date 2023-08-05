import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../auth/types/jwtPayload.type';

// export const GetCurrentUserId = createParamDecorator(
//   (_: undefined, context: ExecutionContext): number => {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user as JwtPayload;
//     return user.sub;
//   },
// );

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user || !user.sub) {
      throw new UnauthorizedException('Missing or invalid JWT token');
    }
    return user.sub;
  },
);


export const GetAuthBoolean = createParamDecorator(
  (_: undefined, context: ExecutionContext): boolean => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.twoFactorAuthenticated;
  },
);
