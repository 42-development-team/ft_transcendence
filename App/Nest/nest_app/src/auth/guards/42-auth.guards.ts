import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoAuthGuards extends AuthGuard('42') {
    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}