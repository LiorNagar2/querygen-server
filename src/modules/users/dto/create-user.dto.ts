import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { AuthProvider, Role } from '../../auth/auth.interface';

export class CreateUserDto {
    @ApiProperty()
    username: string;

    @ApiProperty({ format: 'password' })
    @Exclude()
    password: string;

    @ApiProperty({ format: 'email' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: Role, isArray: true })
    roles: Role[];

    @ApiProperty({ enum: AuthProvider })
    authProvider: AuthProvider;
}
