import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategy';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import googleOauthConfig from '../config/google-oauth.config';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    MailModule,
    ConfigModule.forFeature(googleOauthConfig),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, GoogleStrategy],
})
export class AuthModule {}
