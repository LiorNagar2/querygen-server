import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Database, DatabaseSchema } from './database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Database.name, schema: DatabaseSchema }]),
    OpenAiModule
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
}
