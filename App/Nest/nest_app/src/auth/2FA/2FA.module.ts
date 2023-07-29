import { Module } from '@nestjs/common';
import { TwoFAService } from './2FA.service';
import { TwoFAController } from './2FA.controller';
import { UsersService } from '../../users/users.service';

@Module({
  imports: [],
  controllers: [TwoFAController],
  providers: [TwoFAService, UsersService],
  exports: [TwoFAService]
})
export class TwoFAModule {}