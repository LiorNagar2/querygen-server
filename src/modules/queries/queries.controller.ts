import { Body, Controller, Get, Param, Post, Req, Query as QueryParams, Patch } from '@nestjs/common';
import { BaseController, CrudActions } from 'nest-mongo-crud';
import { QueriesService } from './queries.service';
import { Query } from './query.schema';
import { Request } from 'express';
import { CreateQueryDto } from './dto/create-query.dto';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdateQueryDto } from './dto/update-query.dto';

@Controller('database/:dbId/queries')
export class QueriesController {

  constructor(private readonly queriesService: QueriesService) {
  }

  /*protected exposeRoutes(): CrudActions[] {
    return [CrudActions.CREATE, CrudActions.READ, CrudActions.UPDATE, CrudActions.DELETE];
  }*/

  @Get()
  getQueries(@Param('dbId') dbId: string, @QueryParams() query: PaginationQueryDto) {
    const { page = 1, limit = -1 } = query;
    return this.queriesService.findAll({ databaseId: dbId }, Number(page), Number(limit));
  }

  @Post()
  createQuery(@Param('dbId') dbId: string, @Body() dto: CreateQueryDto, @Req() req: Request) {
    //return this.queryService.createQuery(dbId, dto, req.user.id);
    return this.queriesService.create({ ...dto, databaseId: dbId });
  }

  @Get(':id')
  getQuery(@Param('id') id: string) {

  }

  @Patch(':id')
  updateQuery(@Param('dbId') dbId:string, @Param('id') id: string, @Body() dto: UpdateQueryDto) {
    return this.queriesService.update({ _id: id }, dto);
  }

}
