import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';


// how to validate user in our case ?
interface FortyTwoUser {
    id: number,
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,

    ) {}

    async generateJWT(userId: number): Promise<string> {
        return await this.jwtService.sign({sub: userId});
    }

    verifyJWT(token: string): any {
        try {
            return this.jwtService.verify(token);
        }
        catch {
            return null;
        }
    }

    async login(req: any): Promise<string> {
       try {
           const jwtSigned = await this.generateJWT(req.user.id);
           return jwtSigned;
        }
        catch (error) {
            console.log(error.message);
        }
    }
}
