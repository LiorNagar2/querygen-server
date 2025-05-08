import { Injectable } from '@nestjs/common';
import { Sequelize, QueryTypes } from 'sequelize';
import { BaseService } from 'nest-mongo-crud';
import { Database } from './database.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type QueryResult = {
  success: boolean;
  message?: string;
  data?: any;
};

type ColumnDefinition = {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimary: boolean;
};

export type DatabaseStructure = Record<string, ColumnDefinition[]>;

@Injectable()
export class DatabaseService extends BaseService<Database> {
  private connections: Record<string, Sequelize> = {}; // Store multiple DB connections

  constructor(
    @InjectModel(Database.name)
    private readonly databaseModel: Model<Database>
  ) {
    super(databaseModel);
  }

  async connectDatabase(id: string): Promise<{ success: boolean; message: string, schema?: DatabaseStructure}> {
    try {
      const db = await this.findOne({ _id: id });
      const sequelize = new Sequelize({
        dialect: db.type as any, // Consider making `type` a union: 'mysql' | 'postgres' | etc.
        host: db.host,
        username: db.user,
        password: db.password,
        database: db.name,
        logging: false,
      });

      await sequelize.authenticate();
      this.connections[id] = sequelize;
      const schema = await this.getDatabaseStructure(id);

      return {
        success: true,
        message: 'Database connected: ' + sequelize.getDatabaseName(),
        schema,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  getDatabase(id: string): Sequelize | null {
    return this.connections[id] || null;
  }

  async executeQuery(id: string, query: string): Promise<QueryResult> {
    const db = this.getDatabase(id);
    if (!db) return { success: false, message: 'Database not connected' };

    try {
      const result = await db.query(query, { type: QueryTypes.RAW });
      return { success: true, data: result[0] };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async getDatabaseStructure(id: string): Promise<DatabaseStructure | null> {
    const db = this.getDatabase(id);
    if (!db) return null;

    try {
      const [tables]: [any[], unknown] = await db.query("SHOW TABLES");

      const schema: DatabaseStructure = {};

      for (const row of tables) {
        const tableName = Object.values(row)[0]?.toString();
        const [columns]: [any[], unknown] = await db.query(`SHOW COLUMNS FROM \`${tableName}\``);

        schema[tableName] = columns.map((col: any): ColumnDefinition => ({
          name: col.Field,
          type: col.Type,
          isNullable: col.Null === 'YES',
          isPrimary: col.Key === 'PRI',
        }));
      }

      return schema;
    } catch (error) {
      return null;
    }
  }
}
