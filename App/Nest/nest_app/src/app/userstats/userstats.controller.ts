import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserStatsService } from "./userstats.service";
import { create } from "domain";
import { UserIdDto } from "./dto/user-id.dto";
import { UserStatsDto } from "./dto/userstats.dto";

ApiTags('Userstats')
@Controller('userstats')
export class UserstatsController {
	constructor(private userstatsService: UserStatsService) {}

	/* C(reate) */
	@Post('create')
	async createUserStats(@Body() userIdDto: UserIdDto) {
		this.userstatsService.createUserStats(userIdDto);
	}

	/* R(ead) */
	@Get('info')
	async getUserStats(@Body() userIdDto: UserIdDto) {
		const stats = await this.userstatsService.getUserStats(userIdDto);
		return JSON.stringify(stats);
	}

	/* U(pdate) */
	@Patch('update/:id')
	async updateUserStats( @Param('id') id: number, @Body() userUpdateDto: UserStatsDto) {
		this.userstatsService.updateUserStats(id, userUpdateDto);
	}

	/* D(elete) */
	@Delete('delete')
	async deleteUserStats(@Body() userIdDto: UserIdDto) {
		this.userstatsService.deleteUserStats(userIdDto);
	}

}