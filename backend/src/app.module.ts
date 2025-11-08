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
import googleOAuthConfig from './config/google-oauth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [googleOAuthConfig],
    }),
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
  ],
})
export class AppModule {}
