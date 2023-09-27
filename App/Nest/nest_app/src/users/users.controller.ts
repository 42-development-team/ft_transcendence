import { Controller, Get, Post, Put, Delete, Body, Param, Logger, ParseIntPipe, Request, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto, UpdateUsernameDto } from './dto';
import { UsersService } from './users.service';
import { Public } from '../auth/public.routes';

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
        // this.logger.log(`gettin user with ID ${id}`);
        return this.userService.getUserFromId(Number(id));
    }

    @Get('/usernameExist/:username')
    async usernameExist(@Param('username') username: string, @Res() res: Response) {
        try {
            const user = await this.userService.getUserFromUsername(username);
            const isUsernameTaken = !!user; // double negation to turn user into a boolean
            //If the user object is not null or undefined (truthy),
            // !!user will evaluate to true, indicating that the username is taken.
            // If the user object is null or undefined (falsy),
            // !!user will evaluate to false, indicating that the username is available.
            res.status(HttpStatus.OK).send({ isUsernameTaken });
        } catch (error) {
            console.error('Error checking username availability:', error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred while checking username availability.');
        }
    }

	@Public()
	@Get('/getCurrentStatus/:id')
    async getStatus(@Param('id') id: string, @Res() response: Response) {
		try {
			const userId: number = parseInt(id);
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

    /* D(elete) */
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
        this.logger.log(`Deleting user with ID: ${id}`);
        await this.userService.deleteUser(id);
        // todo update in order to remove the user from channel admins/members list
    }
}
