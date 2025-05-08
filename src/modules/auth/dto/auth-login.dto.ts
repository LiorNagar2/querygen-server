import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDtoDto {
    @ApiProperty()
    username: string;

    @ApiProperty({ format: 'password' })
    password: string;
}
