import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { JwtAuthGuard } from './Guards/jwtGuard';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  async register(@Body() dto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
    const { refresh_token, ...result } = await this.authService.register(dto);
    res.cookie('refreshToken', refresh_token, REFRESH_COOKIE_OPTIONS);
    return result;
  }

  // ================= LOCAL LOGIN =================

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { refresh_token, ...result } = await this.authService.login(req.user);
    res.cookie('refreshToken', refresh_token, REFRESH_COOKIE_OPTIONS);
    return result;
  }

  // ================= REFRESH TOKEN =================

  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const { refresh_token, ...result } = await this.authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', refresh_token, REFRESH_COOKIE_OPTIONS);
    return result;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return { message: 'Logged out' };
  }

  // ================= GOOGLE LOGIN =================

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req, @Res() res) {
    res.cookie('refreshToken', req.user.refresh_token, REFRESH_COOKIE_OPTIONS);

    return res.redirect(
      `http://localhost:5173/auth/success?token=${req.user.access_token}`,
    );
  }

  // ================= GITHUB LOGIN =================

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() { }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubRedirect(@Req() req, @Res() res) {
    res.cookie('refreshToken', req.user.refresh_token, REFRESH_COOKIE_OPTIONS);

    return res.redirect(
      `http://localhost:5173/auth/success?token=${req.user.access_token}`,
    );
  }

  // ================= CURRENT USER =================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req) {
    return this.authService.getMe(req.user.id);
  }
}
