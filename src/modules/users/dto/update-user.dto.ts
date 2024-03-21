import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
    @IsOptional()
    @IsString()
    @ValidateIf((_, value) => value !== null)
    password?: string | null;
}
