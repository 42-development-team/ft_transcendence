import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
        super({
            clientID: process.env.TRANSCENDENCE_TOKEN,
            clientSecret: process.env.TRANSCENDENCE_SECRET,
            callbackURL: process.env.REDIRECT_URL,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, cb): Promise<any> {

        try {
            const user = this.usersService.createOrFindUser(profile.username);
            return cb(null, user);
        }
        catch (error){
            console.error(error.message);
        }
    }
}