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
import { ThrottlerModule } from '@nestjs/throttler';
import { HeroModule } from './hero/hero.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [googleOAuthConfig],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'auth-sensitive',
        ttl: 60000, // 1 minute
        limit: 1, // Login, password reset, OTP verification
      },
      {
        name: 'auth-general',
        ttl: 60000, // 1 minute
        limit: 10, // Registration, token refresh
      },
      {
        name: 'api-general',
        ttl: 60000, // 1 minute
        limit: 100, // General API endpoints
      },
      {
        name: 'api-burst',
        ttl: 1000, // 1 second
        limit: 10, // Short burst protection
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
  ],
})
export class AppModule {}
