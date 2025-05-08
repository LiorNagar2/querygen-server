import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from './google-auth/google-auth.service';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '24h' },
            }),

        }),
    ],
    providers: [AuthService, GoogleAuthService],
    controllers: [AuthController],
})
export class AuthModule {}
