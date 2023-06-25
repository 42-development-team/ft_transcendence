import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{ // extends PrismaClient: when Nest creates an instances of PrismaService, it also instantiates the PrismaClient.
    constructor(){
        super();
    }
}
