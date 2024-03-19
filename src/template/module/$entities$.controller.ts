import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
  Req,
} from '@nestjs/common';
import { $Entities$Service } from './$entities$.service';
import { Create$Entity$Dto } from './dto/create$Entity$.dto';
import { Update$Entity$Dto } from './dto/update$Entity$.dto';
import { ListAll$Entities$Dto } from './dto/listAll$Entities$.dto';
import PaginationWrapper from 'src/utils/pagination/PaginationWrapper';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/lib/swagger/ApiPaginatedResponse';
import { Request } from 'express';
import { AutenticatedJwtUser } from 'src/types/modules/auth/signinJwtPayload';
import { RequiredPermission } from 'src/modules/auth/strategy/roles.guard';
import { Listed$Entity$Dto } from './dto/listed$Entity$.dto';
import { RolePermissionName } from 'src/types/roles/rolePermission';

const requiredPermission: RolePermissionName =
  '$permission_name$' as RolePermissionName;

@ApiTags('$entity_kebab$')
@Controller('$entity_kebab$')
export class $Entities$Controller {
  constructor(private readonly $entity$Service: $Entities$Service) {}

  @Post()
  @RequiredPermission(requiredPermission, 'create')
  create(@Body() create$Entity$Dto: Create$Entity$Dto) {
    return this.$entity$Service.create(create$Entity$Dto);
  }

  @Get()
  @ApiPaginatedResponse(Listed$Entity$Dto)
  async findAll(@Req() req: Request, @Query() params: ListAll$Entities$Dto) {
    const user = req.user as AutenticatedJwtUser;
    const shouldSimplifyResult =
    !user.getPermissionByName(requiredPermission)?.read;

    const data = await this.$entity$Service.listAll(
      params,
      shouldSimplifyResult,
    );

    return PaginationWrapper({
      data,
      page: params.page,
      limit: params.limit,
    });
  }

  @Get(':id')
  @RequiredPermission(requiredPermission, 'read')
  findOne(@Param('id') id: string) {
    return this.$entity$Service.findById({ id });
  }

  @Put(':id')
  @RequiredPermission(requiredPermission, 'update')
  update(
    @Param('id') id: string,
    @Body() update$Entity$Dto: Update$Entity$Dto,
  ) {
    return this.$entity$Service.update(id, update$Entity$Dto);
  }

  @HttpCode(204)
  @Delete(':id')
  @RequiredPermission(requiredPermission, 'delete')
  remove(@Param('id') id: string) {
    return this.$entity$Service.remove(id);
  }
}
