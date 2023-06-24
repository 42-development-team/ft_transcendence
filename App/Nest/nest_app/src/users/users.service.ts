import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client' 

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                email: createUserDto.email,
                password: createUserDto.password,
                avatar: createUserDto.avatar,
            }
        });
        return user;
    } 
}
