import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserStatsService } from "./userstats.service";
import { create } from "domain";
import { UserIdDto } from "./dto/user-id.dto";
import { UserStatsDto } from "./dto/userstats.dto";
import { response } from "express";

ApiTags('Userstats')
@Controller('userstats')
export class UserstatsController {
	constructor(private userstatsService: UserStatsService) { }

	/* C(reate) */
	@Post('create')
	async createUserStats(@Body() userIdDto: UserIdDto) {
		try {
			const newUserStats = await this.userstatsService.createUserStats(userIdDto);

			response.status(HttpStatus.CREATED);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

	/* R(ead) */
	@Get('info')
	async getUserStats(@Body() userIdDto: UserIdDto) {
		try {
			const stats = await this.userstatsService.getUserStats(userIdDto);

			response.status(HttpStatus.OK).send(stats);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

	/* U(pdate) */
	@Patch('update/:id')
	async updateUserStats(@Param('id') id: number, @Body() userUpdateDto: UserStatsDto) {
		try {
			this.userstatsService.updateUserStats(id, userUpdateDto);

			response.status(HttpStatus.OK);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}


	/* D(elete) */
	@Delete('delete')
	async deleteUserStats(@Body() userIdDto: UserIdDto) {
		try {
			this.userstatsService.deleteUserStats(userIdDto);

			response.status(HttpStatus.OK);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

}