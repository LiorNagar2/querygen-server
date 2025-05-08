import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegisterDto {
    @ApiProperty()
    username: string;

    @ApiProperty({ format: 'password' })
    password: string;

    @ApiProperty({ format: 'email' })
    @IsEmail()
    email: string;
}

export class RegisterResponse {
    @ApiProperty()
    access_token: string;
}
