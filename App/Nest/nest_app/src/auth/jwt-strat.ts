import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super ({
            // extract method for the token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ensure that the jwt haven't expire (401 Unauthorized if it is expired)
            ignoreExpiration: false,
            // secret key to sign the token
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    // passport verifies jwt signature and decodes json.
    // then it call the validate function passing the decoded json in parameter
    // this guarantee that we receive a valid token that we have previously signed and issued to a valid user
    validate(payload: any): any {
        console.log("===============PAYLOAD===============");
        console.log(payload);
        console.log("===============PAYLOAD RETURN===============");
        return payload;
    }
    // As a result of all this, our response to the validate() callback is trivial: we simply return an object containing the userId property
    // Recall again that Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object
}