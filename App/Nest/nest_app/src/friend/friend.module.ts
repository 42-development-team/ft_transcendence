import { Module } from "@nestjs/common";
import { ChatroomModule } from "src/chatroom/chatroom.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [PrismaModule, ChatroomModule, UsersModule],
  controllers: [FriendController],
  providers: [FriendService, UsersService],
  exports: [FriendService]
})
export class FriendModule {}
