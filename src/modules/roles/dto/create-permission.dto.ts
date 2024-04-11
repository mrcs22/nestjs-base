import { IsBoolean, IsIn, IsString, ValidateIf } from 'class-validator';
import { RolePermissionName, iterableRolePermissionNames } from 'src/types/roles/role-permission';

export class CreatePermissionDto {
  @IsString()  
  @IsIn(iterableRolePermissionNames)
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
