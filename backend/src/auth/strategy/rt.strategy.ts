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
      jwtFromRequest: (req: Request) => {
        // Prefer Authorization header, fallback to cookie for backward compatibility
        const auth = req.headers['authorization'];
        const bearer = Array.isArray(auth) ? auth[0] : auth;
        const headerToken = bearer?.startsWith('Bearer ')
          ? bearer.substring('Bearer '.length)
          : undefined;
        return headerToken || req.cookies['refresh_token'] || null;
      },
      secretOrKey: config.get('REFRESH_JWT_SECRET') || 'defaultsecret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    // Extract refresh token for downstream service verification
    const auth = req.headers['authorization'];
    const bearer = Array.isArray(auth) ? auth[0] : auth;
    const headerToken = bearer?.startsWith('Bearer ')
      ? bearer.substring('Bearer '.length)
      : undefined;
    const refreshToken = headerToken || req.cookies['refresh_token'];
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
