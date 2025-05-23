import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Database } from '../database/database.schema';

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
}

@Schema({ _id: false }) // 👈 No _id for subdocument
class GraphConfig {
  @Prop()
  labelColumn?: string;

  @Prop({ type: [String], default: [] }) // ✅ Array of strings for multiple value columns
  valueColumns?: string[];

  @Prop({ enum: ChartType })
  chartType?: ChartType;
}

@Schema({ timestamps: true })
export class Query extends Document {
  @Prop({ type: Types.ObjectId, ref: Database.name, required: true })
  databaseId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  query: string;

  @Prop({ type: GraphConfig, _id: false }) // ✅ Use updated GraphConfig
  graphConfig?: GraphConfig;
}

export const QuerySchema = SchemaFactory.createForClass(Query);
