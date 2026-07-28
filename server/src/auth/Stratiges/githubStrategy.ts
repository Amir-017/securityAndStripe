
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
@Injectable()
export class GithubStrategy extends PassportStrategy(
  Strategy,
  'github',
) {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),

      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),

      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),

      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user =
      await this.authService.validateGithubUser(profile);

    done(null, user);
  }
}
