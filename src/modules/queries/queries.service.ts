import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Query } from './query.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from 'nest-mongo-crud';

@Injectable()
export class QueriesService extends BaseService<Query> {

  constructor(
    @InjectModel(Query.name) private readonly queryModel: Model<Query>,
  ) {
    super(queryModel);
  }

  async findAllByDatabaseId(dbId: string) {
    return this.queryModel.find({ databaseId: dbId }).exec();
  }

  async listQueries(dbId: number){

  }
}
