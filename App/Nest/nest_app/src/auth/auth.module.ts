import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './strategies/passport-strat';
import { JwtStrategy } from './strategies/jwt-strat';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { APP_GUARD } from '@nestjs/core';
import { TwoFAModule } from './2FA/2FA.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        TwoFAModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async(configService: ConfigService) => ({
                secret: configService.get<string>('jwtSecret'),
                signOptions: { expiresIn: '7d' },
            }),
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
