import { Module } from '@nestjs/common';
import { FirstLoginService } from './firstLogin.service';
import { FirstLoginController } from './firstLogin.controller';
import { UsersService } from 'src/users/users.service';

@Module({
    imports: [],
    controllers: [FirstLoginController],
    providers: [FirstLoginService, UsersService],
    exports: [FirstLoginService]
  })
  export class FirstLoginModule {}