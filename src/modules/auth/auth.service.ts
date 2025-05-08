import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RegisterDto, RegisterResponse } from './dto/register.dto';
import { AuthProvider, Role, SocialLoginRequest, SocialUser } from './auth.interface';
import { User } from '../users/users.schema';
import { GoogleAuthService } from './google-auth/google-auth.service';

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private readonly googleAuthService: GoogleAuthService,
    ) {}

    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }

        const jwt = await this.generateJwt(user);
        return {access_token: jwt};
    }

    async register(dto: RegisterDto): Promise<RegisterResponse> {
        const user = await this.usersService.create({
          ...dto,
          roles: [Role.User],
          authProvider: AuthProvider.LOCAL
        });
        return await this.login(dto.username, dto.password);
    }

    async socialLogin(body: SocialLoginRequest): Promise<{ access_token: string }> {
        let socialUser: SocialUser;

        switch (body.provider) {
          case AuthProvider.GOOGLE:
            socialUser = await this.googleAuthService.verify(body.token);
            break;
          default:
            throw new BadRequestException('Unsupported provider');
        }

        let user = await this.usersService.findOne(socialUser.email);
        if (!user) {
          const password = this.usersService.generateRandomPassword();
            user = await this.usersService.create({
              username: socialUser.email,
              email: socialUser.email,
              password,
              roles: [Role.User],
              authProvider: body.provider
            });
        }

      const jwt = await this.generateJwt(user);
      return { access_token: jwt };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username).select('+password');
    if (user && this.usersService.verifyPass(pass, user.password)) {
      return user;
    }
    return null;
  }

  async generateJwt(user: User, options?: JwtSignOptions){
    const payload = {
      username: user.username,
      _id: user._id.toString(),
      roles: user.roles,
    };

    return await this.jwtService.signAsync(payload, options);
  }

}
