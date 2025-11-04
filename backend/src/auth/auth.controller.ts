import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard, RtGuard } from './guard';
import { GetUser } from './decorator';
import { Tokens } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a user' })
  async register(@Body() dto: AuthRegisterDto): Promise<Tokens> {
    const tokens = await this.authService.register(dto);
    // Return tokens in the body for client-side storage
    return tokens;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() dto: AuthLoginDto): Promise<Tokens> {
    const tokens = await this.authService.login(dto);
    // Return tokens in the body for client-side storage
    return tokens;
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  async logout(@GetUser('id') userId: string) {
    await this.authService.logout(userId);
    return { message: 'User logged out successfully' };
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
  ): Promise<Tokens> {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    // Return tokens in the body for client-side storage
    return tokens;
  }
}
