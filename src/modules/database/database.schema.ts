import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum DBTypes {
  MYSQL = 'mysql',
  POSTGRES = 'postgres',
  SNOWFLAKE = 'snowflake'
}

@Schema()
export class Database extends Document {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  connectionName: string;

  @Prop({ required: true })
  type: DBTypes;

  @Prop({ required: true })
  host: string;

  @Prop({ required: false })
  user: string;

  @Prop({ required: false })
  password: string;
}

export const DatabaseSchema = SchemaFactory.createForClass(Database);