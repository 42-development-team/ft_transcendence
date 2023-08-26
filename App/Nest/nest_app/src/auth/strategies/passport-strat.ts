import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
        super({
            clientID: configService.get<string>('transcendenceToken'),
            clientSecret: configService.get<string>('transcendenceSecret'),
            callbackURL: configService.get<string>('redirectUri'),
        });
		// this.clientID = configService.get<string>('transcendenceToken');
    }


    async validate(accessToken: string, refreshToken: string, profile: any, cb): Promise<any> {

        try {
			// console.log("client id = ", this.clientID);
			console.log("profile id = ", profile.id);
            const user = this.usersService.createOrFindUser(profile.username);
            return cb(null, user);
        }
        catch (error){
            console.error(error.message);
        }
    }
}
