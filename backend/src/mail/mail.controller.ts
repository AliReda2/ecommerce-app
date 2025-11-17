import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiProperty } from '@nestjs/swagger';
import { SendOtpDto } from './dto/sendOtp.dto';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('otp')
  @ApiProperty({ description: 'Send OTP to user email' })
  async sendOtpMail(@Body() data: SendOtpDto) {
    return this.mailService.sendOtp(data.email);
  }
}
