import { Module } from "@nestjs/common";
import { ChatroomModule } from "src/chatroom/chatroom.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";

@Module({
  imports: [PrismaModule, ChatroomModule, UsersModule],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService]
})
export class FriendModule {}