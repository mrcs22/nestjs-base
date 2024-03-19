import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { CreatePermissionDto } from './createPermission.dto';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @Type(() => CreatePermissionDto)
  @ValidateNested({each:true})
  permissions: CreatePermissionDto[];
}
