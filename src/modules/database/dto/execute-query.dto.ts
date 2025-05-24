import { ApiProperty } from "@nestjs/swagger";

export class ExecuteQueryDto {
    @ApiProperty()
    query: string;
}

