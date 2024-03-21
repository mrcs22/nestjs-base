import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  isEmail,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { IsGenericRelationItem } from 'src/lib/swagger/validations';
import { GenericRelationItemDto } from 'src/utils/helpers/dto/generic-relation-item.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(11)
  @MaxLength(14)
  document: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  @Transform(({ value }) => {
    return value && typeof value === 'string' ? JSON.parse(value) : value;
  })
  isActive: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsGenericRelationItem()
  role: GenericRelationItemDto;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', nullable: true})
  @Transform(({ value }) => {
    return value && typeof value === 'string' ? JSON.parse(value) : value;
  })
  picture?: Express.Multer.File | null;
}
