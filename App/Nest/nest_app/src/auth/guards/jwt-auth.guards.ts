import {Injectable, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../public.routes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(), // check if @Public decorator is present on the handler
          context.getClass(), // check if @Public decorator is present on the class 
        ]);
        if (isPublic) return true;

        return super.canActivate(context);
    }

    override handleRequest(err, user, info, context) {
        if (err || !user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}