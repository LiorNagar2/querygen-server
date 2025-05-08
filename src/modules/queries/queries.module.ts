import { Module } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Query, QuerySchema } from './query.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Query.name, schema: QuerySchema }])],
  controllers: [QueriesController],
  providers: [QueriesService],
})
export class QueriesModule {
}
