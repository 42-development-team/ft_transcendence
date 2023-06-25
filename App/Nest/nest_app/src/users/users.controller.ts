import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'
/* 
Swagger is an open-source framework that simplifies the documentation, design, and testing of RESTful APIs. 
It provides a set of tools and specifications, including the Swagger UI and the OpenAPI Specification which document APIs in a standardized way.
The OpenAPI Specification (OAS) is a specification document written in JSON or YAML format 
that defines the structure and behavior of RESTful APIs. It describes the available endpoints, 
their input/output parameters, authentication requirements, response formats, and more.
*/
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    logger = new Logger ('UsersController'); // instanciating Lgger class to use it for debugging instead of console.log etc

    @Get('/')
    async getAllUsers(): Promise<CreateUserDto[]>{
        this.logger.log('gettin all users');
        const userListDto = await this.userService.getAllUsers();
        return userListDto;
    }

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
