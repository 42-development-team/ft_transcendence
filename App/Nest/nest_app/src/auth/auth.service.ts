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

    async verifyJWT(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        }
        catch {
            return null;
        }
    }

    async login(user: any): Promise<string> {
       try {
           const jwtSigned = await this.generateJWT(user.id);
           return jwtSigned;
        }
        catch (error) {
            console.log(error.message);
        }
    }
}
