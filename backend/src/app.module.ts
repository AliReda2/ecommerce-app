import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { MailModule } from './mail/mail.module';
import { AnalyticsModule } from './analytics/analytics.module';
import googleOAuthConfig from './config/google-oauth.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HeroModule } from './hero/hero.module';
import { APP_GUARD } from '@nestjs/core';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [googleOAuthConfig],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'authSensitive',
        ttl: 60000, // 1 minute
        limit: 5, // Login, password reset, OTP verification
      },
      {
        name: 'authGeneral',
        ttl: 60000, // 1 minute
        limit: 10, // Registration, token refresh
      },
      {
        name: 'apiGeneral',
        ttl: 60000, // 1 minute
        limit: 150, // General API endpoints
      },
      {
        name: 'apiBurst',
        ttl: 60000, // 1 minute
        limit: 50, // General API endpoints
      },
    ]),
    AuthModule,
    PrismaModule,
    UserModule,
    HealthModule,
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    WishlistModule,
    MailModule,
    AnalyticsModule,
    HeroModule,
    TagModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
