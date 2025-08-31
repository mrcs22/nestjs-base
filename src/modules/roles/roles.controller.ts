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
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ListAllRolesDto } from "./dto/list-roles.dto";
import PaginationWrapper from "src/utils/pagination/pagination-wrapper";
import { ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "src/lib/swagger/paginated-response";
import { Request } from "express";
import { AutenticatedJwtUser } from "src/types/modules/auth/signin-jwt-payload";
import { RequiredPermission } from "src/modules/auth/strategy/roles.guard";
import { ListedRoleDto } from "./dto/listed-role.dto";
import { RolePermissionName } from "src/types/roles/role-permission";

const requiredPermission: RolePermissionName = "roles";

@ApiTags("roles")
@Controller("roles")
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  @RequiredPermission(requiredPermission, "create")
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiPaginatedResponse(ListedRoleDto)
  async findAll(@Req() req: Request, @Query() params: ListAllRolesDto) {
    const user = req.user as AutenticatedJwtUser;
    const shouldSimplifyResult =
      !user.getPermissionByName(requiredPermission)?.read;

    const data = await this.roleService.listAll(params, shouldSimplifyResult);

    return PaginationWrapper({
      data,
      page: params.page,
      limit: params.limit,
    });
  }

  @Get(":id")
  @RequiredPermission(requiredPermission, "read")
  findOne(@Param("id") id: string) {
    return this.roleService.findById({ id });
  }

  @Put(":id")
  @RequiredPermission(requiredPermission, "update")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @HttpCode(204)
  @Delete(":id")
  @RequiredPermission(requiredPermission, "delete")
  remove(@Param("id") id: string) {
    return this.roleService.remove(id);
  }
}
