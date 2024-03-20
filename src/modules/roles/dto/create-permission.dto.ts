import { IsBoolean, ValidateIf } from 'class-validator';
import { EnumFromArray } from 'src/lib/swagger/validations';
import { RolePermissionName, iterableRolePermissionNames } from 'src/types/roles/role-permission';

export class CreatePermissionDto {
  @EnumFromArray(iterableRolePermissionNames)
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
