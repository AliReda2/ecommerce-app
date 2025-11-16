import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthRegisterDto } from './dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { VerifyEmailDto } from 'src/mail/dto/verifyEmail.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
    private userService: UserService,
  ) {}

  async register(dto: AuthRegisterDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: hash,
        },
      });

      // Send OTP to the user
      await this.mailService.sendOtp(user.id, user.email);

      return {
        message: 'Registration successful. Please verify your email.',
        userId: user.id,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use.');
        }
      }
      throw error;
    }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const verified = await this.mailService.verifyEmail(dto);

    if (!verified) {
      throw new ForbiddenException('Invalid or expired OTP.');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const fullName = `${user.firstName} ${user.lastName}`;

    const tokens = await this.signToken(user.id, user.role, fullName);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return {
      message: 'Email verified successfully.',
      tokens,
    };
  }

  async login(dto: AuthLoginDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        role: true,
        password: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });
    // If user not found, throw an error
    if (!user) throw new ForbiddenException('Credentials incorrect');

    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }
    // Compare the password with the hash
    const passwordMatches = await argon.verify(user.password, dto.password);
    // If password does not match, throw an error
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');
    const fullName = user.firstName + ' ' + user.lastName;

    // Return the new tokens
    const tokens = await this.signToken(user.id, user.role, fullName);
    // Save the refresh token hash in the database
    await this.updateRtHash(user.id, tokens.refresh_token);
    // Return the tokens
    return tokens;
  }
  async googleLogin(id: string) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        role: true,
        password: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });
    // If user not found, throw an error
    if (!user) throw new ForbiddenException('User not found (Google login)');

    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }
    const fullName = user.firstName + ' ' + user.lastName;

    // Return the new tokens
    const tokens = await this.signToken(user.id, user.role, fullName);
    // Save the refresh token hash in the database
    await this.updateRtHash(user.id, tokens.refresh_token);
    // Return the tokens
    return tokens;
  }

  async logout(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required for logout.');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRtoken: null },
    });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
        hashedRtoken: true,
        firstName: true,
        lastName: true,
      },
    });
    // If user not found, throw an error
    if (!user || !user.hashedRtoken)
      throw new ForbiddenException('Access Denied');

    // Compare the refresh token with the hash
    const rtMatches = await argon.verify(user.hashedRtoken, rt);
    // If refresh token does not match, throw an error
    if (!rtMatches) throw new ForbiddenException('Access Denied');
    const fullName = user.firstName + ' ' + user.lastName;

    // Generate new tokens
    const tokens = await this.signToken(user.id, user.role, fullName);
    // Save the refresh token hash in the database
    await this.updateRtHash(user.id, tokens.refresh_token);
    // Return the tokens
    return tokens;
  }

  async signToken(userId: string, role: string, fullName: string) {
    // Create a JWT token
    const payload = {
      sub: userId,
      role,
      fullName,
    };
    const [access_token, refresh_token] = await Promise.all([
      await this.jwt.signAsync(payload, {
        expiresIn: this.config.get('ACCESS_JWT_EXPIRES_IN'),
        secret: this.config.get('ACCESS_JWT_SECRET'),
      }),
      await this.jwt.signAsync(payload, {
        expiresIn: this.config.get('REFRESH_JWT_EXPIRES_IN'),
        secret: this.config.get('REFRESH_JWT_SECRET'),
      }),
    ]);
    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRtoken: hash,
      },
    });
  }

  async validateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    isVerified: true;
  }) {
    const existingUser = await this.userService.findUserByEmail(
      googleUser.email,
    );

    if (existingUser) {
      return existingUser;
    }

    return await this.userService.createUser({
      ...googleUser,
      //generate a random
      password: Math.random().toString(36).slice(-8),
    });
  }
}
