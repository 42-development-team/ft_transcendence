import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { json } from 'body-parser';
import { throwError } from 'rxjs';

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
            callbackURL: process.env.REDIRECT_URL,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, cb): Promise<any> {

        try {

            // console.log(profile);
            const user = this.usersService.createOrFindUser(profile.username);
            this.authService.login(user);
            // console.log("=========USER DB INFO=========");
            // console.log(user);
            return cb(null, user);
            return profile;
        }
        catch (error){
            console.error(error.message);
        }
    }
}