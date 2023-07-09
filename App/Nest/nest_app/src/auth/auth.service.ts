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

    generateJWT(userId: number): string {
        return this.jwtService.sign({sub: userId});
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
        const user = await this.usersService.createOrFindUser(req.user.username);
        return this.generateJWT(user.id);
    }
}
