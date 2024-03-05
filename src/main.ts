import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const corsOptions = {
  origin: function (origin: any, callback: any) {
    const allowedOrigins = [process.env.FRONTEND_URL_LOCAL];
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);

  await app.listen(4000);
}
bootstrap();
