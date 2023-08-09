import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [UsersModule],
    providers: [ChatService, JwtService],
    exports: [ChatService],
})
export class ChatModule {}