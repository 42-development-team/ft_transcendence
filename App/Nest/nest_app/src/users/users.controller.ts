import { Controller, Get, Post, Put, Delete, Body, Param, Logger, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'
/*
Swagger is an open-source framework that simplifies the documentation, design, and testing of RESTful APIs.
It provides a set of tools and specifications, including the Swagger UI and the OpenAPI Specification which document APIs in a standardized way.
The OpenAPI Specification (OAS) is a specification document written in JSON or YAML format
that defines the structure and behavior of RESTful APIs. It describes the available endpoints,
their input/output parameters, authentication requirements, response formats, and more.
*/
import { CreateUserDto, UpdateEmailDto, UpdateUsernameDto } from './dto';
import { UsersService } from './users.service';


// Nestjs/swagger decorator to display the routes: localhost:4000/api
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
    async findOne(@Param('id') id: string): Promise<CreateUserDto> {
        this.logger.log(`gettin user with ID ${id}`);
        return this.userService.getUserFromId(Number(id));
    }


    /* U(pdate) */

    @Put('/update_email/:id')
    async updateEmail(@Body() updatedEmail: UpdateEmailDto, @Param('id') id: string): Promise<CreateUserDto> {
        this.logger.log(`Updating email for user with ID ${id}`);
        const { email } = updatedEmail;
        const updatedObject = await this.userService.updateEmail(Number(id), email);
        return updatedObject;
    }

    @Put('/update_username/:id')
    async updateUsername(@Body() updatedUsername: UpdateUsernameDto, @Param('id', ParseIntPipe) id: Number): Promise<CreateUserDto> {
        this.logger.log(`Updating username for user with ID ${id}`);
        const { username } = updatedUsername;
        const updatedObject = await this.userService.updateUsername(Number(id), username);
        return updatedObject;
    }

    // should we add updateAvatar?

    /* D(elete) */

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        this.logger.log(`Deleting user with ID: ${id}`);
        await this.userService.deleteUser(Number(id));
    }
}
