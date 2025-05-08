import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verify(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Google token is invalid');
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      // any other data you want to store
    };
  }
}
