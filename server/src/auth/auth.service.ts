import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Role, User, UserDocument } from 'src/users/schemas/userSchema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  // ================= REGISTER =================

  async register(data: any) {
    const existingUser = await this.userModel.findOne({
      email: data.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userModel.create({
      ...data,
      password: hashedPassword,
      provider: 'local',
      role: Role.USER,
    });

    return this.generateToken(user);
  }

  // ================= LOCAL LOGIN =================

  async validateLocalUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: UserDocument) {
    return this.generateToken(user);
  }

  // ================= GOOGLE LOGIN =================

  async validateGoogleUser(profile: any) {
    const email = profile.emails[0].value;

    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = await this.userModel.create({
        email,
        firstName: profile.name.givenName,
        picture: profile.photos[0].value,
        googleId: profile.id,
        provider: 'google',
        role: Role.USER,
      });
    }

    return this.generateToken(user);
  }

  // ================= GITHUB LOGIN =================

  async validateGithubUser(profile: any) {
    const githubEmail = profile.emails?.[0]?.value;
    const email = githubEmail || `${profile.username}@users.noreply.github.com`;

    let user = await this.userModel.findOne({
      $or: [{ githubId: profile.id }, { email }],
    });

    if (!user) {
      user = await this.userModel.create({
        email,
        firstName: profile.displayName || profile.username,
        picture: profile.photos?.[0]?.value,
        githubId: profile.id,
        provider: 'github',
        role: Role.USER,
      });
    } else if (!user.githubId) {
      user.githubId = profile.id;
      user.provider = user.provider || 'github';
      await user.save();
    }

    return this.generateToken(user);
  }

  // ================= CURRENT USER =================

  async getMe(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
      picture: user.picture,
      provider: user.provider,
    };
  }

 // ================= JWT =================

  private getRefreshSecret() {
    return (
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET') ||
      this.configService.get<string>('API_KEY')
    );
  }

  generateToken(user: UserDocument) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.getRefreshSecret(),
        expiresIn: '7d',
      }),

      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
        picture: user.picture,
      },
    };
  }

  // ================= REFRESH TOKEN =================

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    let payload: { id: string; email: string; role: Role };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.getRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userModel.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return this.generateToken(user);
  }

}





