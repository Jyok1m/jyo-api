import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import * as mongoose from 'mongoose';

@Module({
  imports: [
    // Dotenv configuration
    ConfigModule.forRoot(),

    // MongoDB connection config
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DB_CONNECTION_STRING');

        if (!uri) {
          throw new Error(
            'DB_CONNECTION_STRING is not defined in the environment variables.',
          );
        }

        // Logging the success message here
        console.log('Successfully connected to the Jyogames API DB 🥳');

        // Return the MongooseModuleFactoryOptions object with the URI
        return {
          uri,
          connectionFactory: async () => {
            try {
              // Connection is managed by MongooseModule
              return mongoose.createConnection(uri, { connectTimeoutMS: 2000 });
            } catch (e) {
              console.error('Error connecting to the DB:', e.message);
              throw e; // Propagate the error
            }
          },
        };
      },
      inject: [ConfigService],
    }),

    UserModule,
  ],

  // Controllers
  controllers: [AppController],

  // Providers
  providers: [AppService],
})
export class AppModule {}
