import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // enable cookie parsing so strategies/controllers can read cookies
  app.use(cookieParser());

  // Allow cookies to be sent from frontend. Use specific origin when possible
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001' || 'http://127.0.0.1:5500';
  app.enableCors({
    origin: [
      'https://ecommerce-app-ten-blush.vercel.app',
      'http://localhost:3001', // for dev
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API documentation for the E-Commerce application')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
