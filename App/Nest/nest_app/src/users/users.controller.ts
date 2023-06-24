import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    @Get()
    findAll(): string {
        return 'Get all items';
    }

    @Get(':id')
    findOne(@Param('id') id): string {
        return `User ${id}`;
    }

    @Post()
    create(@Body() CreateUserDto: CreateUserDto): string {
        return `Name: ${CreateUserDto.username}`;
    }

    @Delete(':id')
    delete(@Param('id') id): string {
        return `Delete ${id}`;
    }

    @Put(':id')
    update(@Body() UpdateUserDto: CreateUserDto, @Param('id') id): string {
        return `update ${id} = Userame: ${UpdateUserDto.username}`
    }
}
