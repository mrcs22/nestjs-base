import { IsBoolean, ValidateIf } from 'class-validator';
import { ApiEnumFromArray } from 'src/lib/swagger/ApiEnumFromArray';
import { RolePermissionName, iterableRolePermissionNames } from 'src/types/roles/rolePermission';

export class CreatePermissionDto {
  @ApiEnumFromArray(iterableRolePermissionNames)
  name: RolePermissionName;

  @IsBoolean()
  @ValidateIf((_, value) => value !== null)
  create: boolean | null;

  @IsBoolean()
  @ValidateIf((_, value) => value !== null)
  read: boolean | null;

  @IsBoolean()
  @ValidateIf((_, value) => value !== null)
  update: boolean | null;

  @IsBoolean()
  @ValidateIf((_, value) => value !== null)
  delete: boolean | null;
}
