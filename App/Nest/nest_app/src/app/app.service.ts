import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
// export class AppService {
//   constructor(private readonly userService: UsersService) {}

//   async getUsers(): Promise<any[]> {
//     return this.userService.getAllUsers();
//   }
// }
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}