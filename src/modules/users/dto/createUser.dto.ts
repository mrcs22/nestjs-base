import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  isEmail,
  IsEmail,
} from 'class-validator';
import { IsGenericRelationItem } from 'src/lib/swagger/IsGenericRelationItem';
import { GenericRelationItemDto } from 'src/utils/helpers/dto/selectableItem.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsGenericRelationItem()
  role: GenericRelationItemDto;
}
