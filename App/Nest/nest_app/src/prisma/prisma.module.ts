import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Global decorator allows the provider to be accessible to all other modules without importing
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}