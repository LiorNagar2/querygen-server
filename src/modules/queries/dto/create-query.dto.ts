import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ChartType } from '../query.schema';
import { Type } from 'class-transformer';

class GraphConfigDto {
  @ApiPropertyOptional({ description: 'Column to use as label (X-axis or category)', type: String })
  @IsOptional()
  @IsString()
  labelColumn?: string;

  @ApiPropertyOptional({ description: 'Columns to use as values (Y-axis)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // ✅ Validate each item is a string
  valueColumns?: string[];

  @ApiPropertyOptional({ enum: ChartType, description: 'Chart type to use' })
  @IsOptional()
  @IsEnum(ChartType)
  chartType?: ChartType;
}

export class CreateQueryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  query: string;

  @ApiPropertyOptional({ type: GraphConfigDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GraphConfigDto)
  graphConfig?: GraphConfigDto;
}
