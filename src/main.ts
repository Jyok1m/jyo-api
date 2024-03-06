import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const allowedOrigins = [configService.get('FRONTEND_URL_LOCAL')];

  const corsOptions = {
    origin: function (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  const port = parseInt(configService.get<string>('PORT', '4000'));
  await app.listen(port);
}

bootstrap();
