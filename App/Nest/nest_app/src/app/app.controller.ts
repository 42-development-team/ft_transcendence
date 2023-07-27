import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/public.routes';

@Public()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('users')
  getUsers(){
    return this.prisma.user.findMany();
  }

  // getUsers(): Promise<any> {
  //   return this.appService.getUsers();
  // }
}
