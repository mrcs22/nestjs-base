import { Transform } from 'class-transformer';
import { IsOptional, IsIn, IsString, IsInt } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value) || value)
  @IsInt({ message: 'Page deve ser um número maior que 0' })
  page?: number = 1;

  @Transform(({ value }) => parseInt(value) || value)
  @IsInt({ message: 'Limit deve ser um número maior que 0' })
  limit?: number = 10;

  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  query?: string = '';

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value,
  )
  isActive?: boolean = undefined;
}
