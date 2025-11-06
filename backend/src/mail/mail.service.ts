import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import * as argon from 'argon2';

@Injectable()
export class MailService {
  constructor(private prisma: PrismaService) {}

  async sendOtp(userId: string, email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await argon.hash(otp);

    await this.prisma.emailVerification.upsert({
      where: { userId },
      update: {
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        userId,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    console.log(`Sending OTP ${otp} to email ${email}`);
    return otp;
  }

  async verifyEmail(userId: string, data: VerifyEmailDto) {
    const record = await this.prisma.emailVerification.findUnique({
      where: { userId },
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
        where: { id: userId },
        data: { isVerified: true },
      }),
      this.prisma.emailVerification.delete({ where: { userId } }),
    ]);

    return true;
  }
}
