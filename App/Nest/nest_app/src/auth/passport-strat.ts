import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private jwtService: JwtService,
        // scope: 'public', // ?? but i can use cb function as return in validate
        ) {
        super({
            clientID: process.env.TRANSCENDENCE_TOKEN,
            clientSecret: process.env.TRANSCENDENCE_SECRET,
            callbackURL:process.env.REDIRECT_URI,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback,): Promise<any> {

        return profile;
        // return cb(null, profile);
        // console.log(profile);
    }

    // async login(user: any) {
    //  const payload = this.authService.validateUser;
    //  return {access_token: this.jwtService.sign(payload)};
    // }
}