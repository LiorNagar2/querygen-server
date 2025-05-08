import { Body, Controller, Param, Post } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { OpenAIService } from '../open-ai/open-ai.service';
import { BaseController, CrudActions } from 'nest-mongo-crud';
import { Database } from './database.schema';

interface User {
  username: string;
}

@Controller('database')
export class DatabaseController extends BaseController<Database> {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly openAIService: OpenAIService,
  ) {
    super(databaseService);
  }

  protected exposeRoutes(): CrudActions[] {
    return [CrudActions.READ, CrudActions.CREATE, CrudActions.UPDATE, CrudActions.DELETE];
  }

  @Post(':id/connect')
  async connectDatabase(@Param('id') id: string) {
    return this.databaseService.connectDatabase(id);
  }

  @Post('generate-sql/:id')
  async generateSQL(@Param('id') id: string, @Body('question') question: string) {
    const schema = await this.databaseService.getDatabaseStructure(id); // Get actual schema
    console.log('#########Schema ', schema);
    if (!schema) {
      return { success: false, message: 'Could not fetch database structure' };
    }
    const sql = await this.openAIService.generateSQLQuery(question, schema);

    return { success: true, sql };
  }

  @Post('generate-analytics-sql/:id')
  async generateAnalyticsSql(@Param('id') id: string){
    const schema = await this.databaseService.getDatabaseStructure(id); // Get actual schema
    console.log('#########Schema ', schema);
    if (!schema) {
      return { success: false, message: 'Could not fetch database structure' };
    }
    const res = await this.openAIService.generateAnalyticsQueries(schema);

    return res;
  }

  @Post('query/:id')
  async executeQuery(@Param('id') id: string, @Body('query') query: string) {
    return this.databaseService.executeQuery(id, query);
  }


}
