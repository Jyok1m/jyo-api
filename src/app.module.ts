import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import mongoose from 'mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';

@Module({
  imports: [
    // Dotenv configuration
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    // MongoDB connection config
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongooseModuleFactoryOptions> => {
        const uri = configService.get<string>('DB_CONNECTION_STRING');

        if (!uri) {
          throw new Error(
            'DB_CONNECTION_STRING is not defined in the environment variables.',
          );
        }

        try {
          await mongoose.connect(uri, { connectTimeoutMS: 2000 });
          console.log('Successfully connected to the DB');
          return { uri }; // return the MongooseModuleFactoryOptions object
        } catch (e) {
          console.error('Error connecting to the DB:', e.message);
          // If an error occurs, let it propagate rather than returning an invalid state
          throw e;
        }
      },
      inject: [ConfigService],
    }),
  ],

  // Controllers
  controllers: [AppController, UserController],

  // Providers
  providers: [AppService, UserService],
})
export class AppModule {}
