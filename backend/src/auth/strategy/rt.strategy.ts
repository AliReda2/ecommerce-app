import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          try {
            return (
              (req as any)?.cookies?.refresh_token ||
              ExtractJwt.fromAuthHeaderAsBearerToken()(req as any)
            );
          } catch (e) {
            return null;
          }
        },
      ]),
      secretOrKey: config.get('REFRESH_JWT_SECRET') || 'defaultsecret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refreshTokenFromHeader = req.get('Authorization')
      ? req.get('Authorization')?.replace('Bearer', '').trim()
      : undefined;
    const refreshToken =
      (req as any)?.cookies?.refresh_token || refreshTokenFromHeader;
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        hashedRtoken: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      ...user,
      refreshToken,
    };
  }
}
