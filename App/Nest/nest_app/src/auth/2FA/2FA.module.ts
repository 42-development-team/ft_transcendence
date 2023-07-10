import { Module } from '@nestjs/common';
import { TwoFAService } from './2FA.service';
import { TwoFAController } from './2FA.controller';

@Module({
  imports: [],
  controllers: [TwoFAController],
  providers: [TwoFAService],
  exports: [TwoFAService]
})
export class TwoFAModule {}