import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsString } from 'class-validator';

export enum Role {
    User = 'user',
    Admin = 'admin',
}

export interface TokenPayload {
    username: string;
    _id: string;
    roles: Role[];
}

export class LoginRequest {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}

export class LoginResponse {
    @ApiProperty()
    access_token: string;
}

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
}

export class SocialLoginRequest {
    @ApiProperty({enum: [AuthProvider.GOOGLE]})
    @IsEnum(AuthProvider)
    provider: AuthProvider;

    @ApiProperty()
    @IsString()
    token: string;
}

export interface SocialUser {
    email: string;
    name: string;
    picture?: string;
}
