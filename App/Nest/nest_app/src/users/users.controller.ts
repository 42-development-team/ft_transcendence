import { Controller, Get, Post, Put, Delete, Body, Param, Logger, ParseIntPipe, Request, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger'
/*
Swagger is an open-source framework that simplifies the documentation, design, and testing of RESTful APIs.
It provides a set of tools and specifications, including the Swagger UI and the OpenAPI Specification which document APIs in a standardized way.
The OpenAPI Specification (OAS) is a specification document written in JSON or YAML format
that defines the structure and behavior of RESTful APIs. It describes the available endpoints,
their input/output parameters, authentication requirements, response formats, and more.
*/
import { CreateUserDto, UpdateUsernameDto } from './dto';
import { UsersService } from './users.service';
import { Public } from '../auth/public.routes';

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
        this.logger.log(`Successfully created user with username ${createUserDto.username}` );
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
	@Public()
	@Get('/getCurrentStatus/:id')
    async getStatus(@Param('id') id: string, @Res() response: Response) {
		try {
			const userId: number = parseInt(id);
			// console.log("userId in get Current Status: ", userId);
			const currentStatus: string = await this.userService.getCurrentStatusFromId(userId);
			response.status(HttpStatus.OK).json(currentStatus);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
    }

    /* U(pdate) */

    @Put('/update_username/:id')
    async updateUsername(@Body() updatedUsername: UpdateUsernameDto, @Param('id', ParseIntPipe) id: number): Promise<CreateUserDto> {
        this.logger.log(`Updating username for user with ID ${id}`);
        const { username } = updatedUsername;
        const updatedObject = await this.userService.updateUsername(id, username);
        return updatedObject;
    }

	@Put('/update_status/:id')
    async updatestatus(@Request() req: any, @Res() response: Response) {
		try {
			const userId = req.user.sub;
			const currentStatus = req.body.currentStatus;
			console.log("userId in update status handler: ", userId);
			console.log("currentStatus sent to update status handler: ", currentStatus);
			console.log("currentStatus returned by getCurrentStatus in update status handler: ", currentStatus);
			if (await this.userService.getCurrentStatusFromId(userId) !== currentStatus) {
				this.logger.log(`Updating currentStatus to ${currentStatus} for user with ID ${userId}`);
				this.userService.updateStatus(userId, currentStatus);
			}
			response.status(HttpStatus.OK);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
    }

    // should we add updateAvatar?

    /* D(elete) */

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        this.logger.log(`Deleting user with ID: ${id}`);
        await this.userService.deleteUser(id);
        // todo update in order to remove the user from channel admins/members list
    }
}
