import { IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { CreateUserDataDto, CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDataDto extends CreateUserDataDto {
    @IsOptional()
    @IsString()
    @ValidateIf((_, value) => value !== null)
    password?: string | null;
}

export class UpdateUserDto extends CreateUserDto {
    @ValidateNested()
    @Type(() => UpdateUserDataDto)
    @ApiProperty({ type: () => UpdateUserDataDto })
    data: UpdateUserDataDto;
}
