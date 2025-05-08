import { Post, Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { LoginRequest, LoginResponse, SocialLoginRequest } from './auth.interface';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() body: LoginRequest): Promise<LoginResponse> {
        return this.authService.login(body.username, body.password);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('social-login')
    async socialLogin(@Body() body: SocialLoginRequest) {
        return this.authService.socialLogin(body);
    }
}
