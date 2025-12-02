import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import * as argon from 'argon2';
import Brevo, {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private apiInstance: Brevo.TransactionalEmailsApi;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      throw new Error('BREVO_API_KEY is not defined in environment variables.');
    }

    this.apiInstance = new TransactionalEmailsApi();
    this.apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }

  async sendOtp(email: string) {
    const COOLDOWN_MS = 60 * 1000; // 1 minute
    const MAX_REQUESTS = 5; // per hour
    const WINDOW_MS = 60 * 60 * 1000; // 1 hour

    const now = new Date();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User with this email does not exist.');
    }

    if (user.isVerified) {
      throw new BadRequestException(
        'Email is already verified, try logging in.',
      );
    }

    // Check existing record
    const existing = await this.prisma.emailVerification.findUnique({
      where: { email },
    });

    if (existing) {
      const timeSinceLast = now.getTime() - existing.lastRequestAt.getTime();

      // Enforce cooldown
      if (timeSinceLast < COOLDOWN_MS) {
        throw new BadRequestException(
          `Please wait ${Math.ceil((COOLDOWN_MS - timeSinceLast) / 1000)} seconds before requesting a new OTP.`,
        );
      }

      // Enforce hourly limits
      const withinWindow =
        now.getTime() - existing.lastRequestAt.getTime() < WINDOW_MS;

      if (withinWindow && existing.requestCount >= MAX_REQUESTS) {
        throw new BadRequestException(
          'Maximum OTP requests exceeded. Try again after 1 hour.',
        );
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await argon.hash(otp);

    // Update / create in DB with updated counters
    await this.prisma.emailVerification.upsert({
      where: { email },
      update: {
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        lastRequestAt: now,
        requestCount: existing
          ? existing.lastRequestAt.getTime() + WINDOW_MS < now.getTime()
            ? 1 // reset after 1 hour
            : existing.requestCount + 1
          : 1,
      },
      create: {
        email,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        lastRequestAt: now,
        requestCount: 1,
      },
    });

    const sendSmtpEmail = {
      to: [{ email }],
      sender: { email: 'alireda2572003@gmail.com', name: 'CODART' },
      templateId: 1,
      params: {
        OTP: otp,
        USER_EMAIL: email,
        COMPANY_NAME: 'CODART',
        EXPIRY_TIME: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        SUPPORT_EMAIL: 'support@codart.com',
        LOGO_URL: 'https://codart.vercel.app/codart1.png',
      },
    };

    return await this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  async verifyEmail(data: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return false;
    }
    const record = await this.prisma.emailVerification.findUnique({
      where: { email: data.email },
    });

    if (!record || record.expiresAt < new Date()) {
      return false;
    }

    const isOtpValid = await argon.verify(record.otp, data.otp);
    if (!isOtpValid) {
      return false;
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      }),
      this.prisma.emailVerification.delete({ where: { email: data.email } }),
    ]);

    return true;
  }

  async sendPasswordResetOtp(email: string) {
    const COOLDOWN_MS = 60 * 1000; // 1 minute
    const MAX_REQUESTS = 5; // per hour
    const WINDOW_MS = 60 * 60 * 1000; // 1 hour

    const now = new Date();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User with this email does not exist.');
    }

    // Check existing record
    const existing = await this.prisma.emailVerification.findUnique({
      where: { email },
    });

    if (existing) {
      const timeSinceLast = now.getTime() - existing.lastRequestAt.getTime();

      // Enforce cooldown
      if (timeSinceLast < COOLDOWN_MS) {
        throw new BadRequestException(
          `Please wait ${Math.ceil((COOLDOWN_MS - timeSinceLast) / 1000)} seconds before requesting a new OTP.`,
        );
      }

      // Enforce hourly limits
      const withinWindow =
        now.getTime() - existing.lastRequestAt.getTime() < WINDOW_MS;

      if (withinWindow && existing.requestCount >= MAX_REQUESTS) {
        throw new BadRequestException(
          'Maximum OTP requests exceeded. Try again after 1 hour.',
        );
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await argon.hash(otp);

    // Update / create in DB with updated counters
    await this.prisma.emailVerification.upsert({
      where: { email },
      update: {
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        lastRequestAt: now,
        requestCount: existing
          ? existing.lastRequestAt.getTime() + WINDOW_MS < now.getTime()
            ? 1 // reset after 1 hour
            : existing.requestCount + 1
          : 1,
      },
      create: {
        email,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        lastRequestAt: now,
        requestCount: 1,
      },
    });

    const sendSmtpEmail = {
      to: [{ email }],
      sender: { email: 'alireda2572003@gmail.com', name: 'CODART' },
      templateId: 1,
      params: {
        OTP: otp,
        USER_EMAIL: email,
        COMPANY_NAME: 'CODART',
        EXPIRY_TIME: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        SUPPORT_EMAIL: 'support@codart.com',
        LOGO_URL: 'https://codart.vercel.app/codart1.png',
      },
    };

    return await this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }
}
