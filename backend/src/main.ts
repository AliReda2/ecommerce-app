import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Parse cookies
  app.use(cookieParser());

  // Helmet security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false, // Important for Swagger & images
      crossOriginOpenerPolicy: false, // Avoids breaking Swagger UI
      crossOriginEmbedderPolicy: false, // Avoids blocking embeds
    }),
  );

  // CORS
  app.enableCors({
    origin: [
      'https://shopcodartlb.vercel.app',
      'https://shopcodart.vercel.app',
      'http://localhost:3001',
      'http://127.0.0.1:5500',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger
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
