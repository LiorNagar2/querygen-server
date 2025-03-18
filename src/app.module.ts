import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { OpenAiModule } from './modules/open-ai/open-ai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register({
      ttl: 60, // Default time to live in seconds
      max: 100, // Maximum items in cache
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MOGO_URI,
      }),
    }),
    DatabaseModule,
    OpenAiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
