import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './passport-strat';
import { JwtStrategy } from './jwt-strat';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '7d' },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, FortyTwoStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
