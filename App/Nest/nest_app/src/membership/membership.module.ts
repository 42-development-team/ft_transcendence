import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
