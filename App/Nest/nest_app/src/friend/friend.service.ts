import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FriendService {
    constructor(
        private prisma: PrismaService,
    ) {}


    /* C(reate) */
    /* R(ead) */
    /* U(pdate) */
    /* D(elete) */
}