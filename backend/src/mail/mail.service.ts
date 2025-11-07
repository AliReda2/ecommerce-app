import { Injectable } from '@nestjs/common';
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

    const sendSmtpEmail = {
      to: [{ email: email }],
      sender: { email: 'alireda2572003@gmail.com', name: 'CODART' },
      templateId: 1,
      params: {
        OTP: otp,
        USER_EMAIL: email,
        COMPANY_NAME: 'CODART',
        EXPIRY_TIME: '2025-11-07 10:32 AM UTC',
        SUPPORT_EMAIL: 'support@codart.com',
        LOGO_URL: 'https://codart.vercel.app/codart1.png',
      },
    };
    console.log(`Sending OTP ${otp} to email ${email}`);

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
      where: { userId: user.id },
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
      this.prisma.emailVerification.delete({ where: { userId: user.id } }),
    ]);

    return true;
  }
}
