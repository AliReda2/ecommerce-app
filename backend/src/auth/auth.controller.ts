import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a user (email verification required)' })
  register(
    @Body() dto: AuthRegisterDto,
  ): Promise<{ message: string; userId: string }> {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email using OTP' })
  verifyEmail(
    @GetUser('id') userId: string,
    @Body() dto: VerifyEmailDto,
  ): Promise<{ message: string; tokens: Tokens }> {
    return this.authService.verifyEmail(userId, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  login(@Body() dto: AuthLoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  refreshTokens(
    @GetUser('id') userId: string,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
