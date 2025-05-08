import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { OpenAiModule } from './modules/open-ai/open-ai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { QueriesModule } from './modules/queries/queries.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

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
    AuthModule,
    UsersModule,
    DatabaseModule,
    OpenAiModule,
    QueriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
