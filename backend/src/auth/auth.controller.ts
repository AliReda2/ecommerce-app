import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Tokens } from './types';
import { AtGuard, RtGuard } from './guard';
import { GetUser } from './decorator';
import { VerifyEmailDto } from 'src/mail/dto/verifyEmail.dto';
import { GoogleAuthGuard } from './guard/google-auth/google-auth.guard';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly FRONTEND_URL: string;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.FRONTEND_URL =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3001';
  }

  @Throttle({ authSensitive: {} })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a user (email verification required)' })
  register(
    @Body() dto: AuthRegisterDto,
  ): Promise<{ msg: string; userId: string }> {
    return this.authService.register(dto);
  }

  @Throttle({ authSensitive: {} })
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email using OTP' })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ msg: string; tokens: Tokens } | { msg: string }> {
    const result = await this.authService.verifyEmail(dto);

    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    // set cookies: access token (short-lived), refresh token (httpOnly)
    res.cookie('access_token', result.tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie('refresh_token', result.tokens.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // set client-visible flag cookie
    res.cookie('has_auth', '1', {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return only msg to encourage cookie-based auth on client
    return { msg: result.msg };
  }

  @Throttle({ authSensitive: {} })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  async login(
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ msg: string }> {
    const tokens = await this.authService.login(dto);
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    // Fix cookie settings
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // set client-visible flag cookie
    res.cookie('has_auth', '1', {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Don't expose tokens in the response body when using HttpOnly cookies
    return { msg: 'Logged in' };
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  async logout(@GetUser('id') userId: string, @Res() res: Response) {
    // Clear cookies on logout
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    res.clearCookie('has_auth', { path: '/' });
    await this.authService.logout(userId);
    return res.sendStatus(200);
  }

  @Throttle({ authGeneral: {} })
  @UseGuards(AtGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@GetUser() user: any) {
    // Return user information (no tokens)
    return { user };
  }

  @Throttle({ authGeneral: {} })
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  async refreshTokens(
    @GetUser('id') userId: string,
    @GetUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // set client-visible flag cookie after refresh
    res.cookie('has_auth', '1', {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Don't return tokens in the response body; tokens are set via cookies
    return { msg: 'Tokens refreshed' };
  }

  @Throttle({ authGeneral: {} })
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @ApiOperation({ summary: 'Google OAuth2 login' })
  googleLogin() {}

  @Throttle({ authGeneral: {} })
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.googleLogin(req?.user?.id);
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    // set cookies and redirect to frontend without tokens in query
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${this.FRONTEND_URL}`);
  }

  @Throttle({ authGeneral: {} })
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password - send reset OTP' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Throttle({ authGeneral: {} })
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Throttle({ authGeneral: {} })
  @Get('has')
  hasAuth(@Req() req: Request) {
    const hasAccess = !!req.cookies['access_token']; // HttpOnly cookie
    return { hasAuth: hasAccess };
  }
}
