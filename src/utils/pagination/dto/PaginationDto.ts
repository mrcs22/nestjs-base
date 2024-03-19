import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsIn, IsString, IsInt } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value) || value)
  @IsInt({ message: 'Page deve ser um número maior que 0' })
  @ApiProperty({ required: false, default: 1 })
  page?: number = 1;

  @Transform(({ value }) => parseInt(value) || value)
  @IsInt({ message: 'Limit deve ser um número maior que 0' })
  @ApiProperty({ required: false, default: 10 })
  limit?: number = 10;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiProperty({ required: false, default: 'desc' })
  order?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: false, default: '' })
  query?: string = '';

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  @ApiProperty({ required: false, default: undefined })
  isActive?: boolean = undefined;
}
