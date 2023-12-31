import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

const cookieExtractor = (req: { cookies: { [x: string]: any; }; }) => {
    let jwt = null 

    if (req && req.cookies) {
        jwt = req.cookies['jwt'];
    }
    return jwt
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super ({
            // custom method to extract jwt
            jwtFromRequest: cookieExtractor,
            // ensure that the jwt haven't expire (401 Unauthorized if it is expired)
            ignoreExpiration: false,
            // secret key to sign the token
            secretOrKey: configService.get<string>('jwtSecret'),
        });
    }

    // passport verifies jwt signature and decodes json.
    // then it call the validate function passing the decoded json in parameter
    // this guarantee that we receive a valid token that we have previously signed and issued to a valid user
    async validate(payload: any) {
        // return a user object attached to Request.
        // we could ask infos from db to construct a more "complex" user object here.
        return payload;
    }
    // As a result of all this, our response to the validate() callback is trivial: we simply return an object containing the userId property
    // Recall again that Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object
}
