import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './strategies/passport-strat';
import { JwtStrategy } from './strategies/jwt-strat';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { APP_GUARD } from '@nestjs/core';

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
    providers: [AuthService, FortyTwoStrategy, JwtStrategy,
    {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
    },
    ],
    exports: [AuthService],
})
export class AuthModule {}
