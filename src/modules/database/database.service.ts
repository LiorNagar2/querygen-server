import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import {BaseService} from 'nest-crud-service';
import { Database } from './database.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class DatabaseService extends BaseService<Database>{

  constructor(
    @InjectModel(Database.name)
    private readonly databaseModel: Model<Database>
  ){
    super(databaseModel);
  }

  private connections: Record<string, Sequelize> = {}; // Store multiple DB connections

  async connectDatabase(id: string) {
    try {
      const db = await this.findOne({_id: id});
      const sequelize = new Sequelize({
        dialect: db.type, // 'mysql' | 'postgres' | 'snowflake'
        host: db.host,
        username: db.user,
        password: db.password,
        database: db.name,
        logging: false
      });
      await sequelize.authenticate();
      this.connections[id] = sequelize;
      return { success: true, message: 'Database connected: ' + sequelize.getDatabaseName()};
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  getDatabase(id: string): Sequelize | null {
    return this.connections[id] || null;
  }

  async executeQuery(id: string, query: string) {
    const db = this.getDatabase(id);
    if (!db) return { success: false, message: 'Database not connected' };

    try {
      const result = await db.query(query);
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getDatabaseStructure(id: string) {
    const db = this.getDatabase(id);
    if (!db) return null;

    try {
      const [tables]: any = await db.query("SHOW TABLES");
      const schema: Record<string, any> = {};

      for (const row of tables) {
        const tableName = Object.values(row)[0]?.toString();
        const [columns]: any = await db.query(`SHOW COLUMNS FROM \`${tableName}\``);

        schema[tableName] = columns.map((col: any) => ({
          name: col.Field,
          type: col.Type,
          isNullable: col.Null === 'YES',
          isPrimary: col.Key === 'PRI'
        }));
      }

      return schema;
    } catch (error) {
      return null;
    }
  }
}
