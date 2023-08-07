import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "src/users/users.service";



@Injectable()
export class ChatService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private userService: UsersService
    ) {}

    async getUserFromSocket(socket: Socket) {
        const authToken = socket.handshake.headers.cookie.split(";");
        const jwtToken = authToken[0].split("=")[1];
        const secret = this.configService.get<string>('jwtSecret');
        const payload = this.jwtService.verify(jwtToken, {secret: secret});
        const userId = payload.sub;
        // Todo: if userId is undefined or null?
        if (userId) {
            return this.userService.getUserFromId(userId);
        }
    }
}