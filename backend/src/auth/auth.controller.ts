import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Tokens } from './types';
import { AtGuard, RtGuard } from './guard';
import { GetUser } from './decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a user' })
  async register(@Body() dto: AuthRegisterDto, @Res() res: Response) {
    const tokens = await this.authService.register(dto);
    this.setTokenCookies(res, tokens);
    return res.json({ message: 'User registered successfully' });
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() dto: AuthLoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(dto);
    this.setTokenCookies(res, tokens);
    return res.json({ message: 'User logged in successfully' });
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  async logout(@GetUser('id') userId: string, @Res() res: Response) {
    await this.authService.logout(userId);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.json({ message: 'User logged out successfully' });
  }

  @UseGuards(AtGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user' })
  async me(@GetUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  async refreshTokens(
    @GetUser('id') userId: string,
    @GetUser('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.setTokenCookies(res, tokens);
    return res.json({ message: 'Tokens refreshed successfully' });
  }

  private setTokenCookies(res: Response, tokens: Tokens) {
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'lax' allows cookies in cross-origin navigation
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
