import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ChartType } from '../query.schema';
import { Type } from 'class-transformer';

class GraphConfigDto {
  @ApiPropertyOptional({ description: 'Column to use as label (X-axis or category)', type: String })
  @IsOptional()
  @IsString()
  labelColumn?: string;

  @ApiPropertyOptional({ description: 'Column to use as value (Y-axis)', type: String })
  @IsOptional()
  @IsString()
  valueColumn?: string;

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
