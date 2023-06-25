import { Controller, Get, Post, Put, Delete, Body, Param, Logger, BadRequestException } from '@nestjs/common';
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

    /* C(reate) */

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
        this.logger.log('Creating a new user');
        const newUser = await this.userService.createUser(createUserDto);
        this.logger.log(`Successfully created user with username ${createUserDto.username} and email ${createUserDto.email}` );
        return newUser;
    }

    /* R(ead) */

    @Get('/')
    async getAllUsers(): Promise<CreateUserDto[]>{
        this.logger.log('gettin all users');
        const userListDto = await this.userService.getAllUsers();
        return userListDto;
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<CreateUserDto> {
        this.logger.log(`gettin user with ID ${id}`);
        return this.userService.getUserFromId(Number(id));
    }


    /* U(pdate) */

    @Put(':id')
    async update(@Body() updateUserDto: CreateUserDto, @Param('id') id: number): Promise<CreateUserDto> {
        const { username, email, avatar } = updateUserDto; // destructuring the object received in the body request from Client
        if (username){
            this.logger.log(`Updating username for user with ID ${id}`);
            return this.userService.updateUsername(id, username);
        }
        if (email){
            this.logger.log(`Updating email for user with ID ${id}`);
            return this.userService.updateEmail(id, email);
        }
        if (avatar){
            this.logger.log(`Updating avatar for user with ID ${id}`);
            return this.userService.updateAvatar(id, avatar);
        }
        throw new BadRequestException('Invalid update request');
    }

    /* D(elete) */

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        this.logger.log(`Deleting user with ID: ${id}`);
        await this.userService.deleteUser(id);
    }
}
