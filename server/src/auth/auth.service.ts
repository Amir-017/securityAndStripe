import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Role, User, UserDocument } from 'src/users/schemas/userSchema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
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
        // lastName: profile.name.familyName,
        picture: profile.photos[0].value,
        googleId: profile.id,
        provider: 'google',
        role: Role.USER,
      });
    }

    return this.generateToken(user);
  }

 // ================= JWT =================

  generateToken(user: UserDocument) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),

      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        // lastName: user.lastName,
        role: user.role,
        picture: user.picture,
      },
    };
  }

}





