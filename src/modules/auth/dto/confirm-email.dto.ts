import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length, Max, MaxLength, Min, MinLength } from 'class-validator';

export class ConfirmEmailDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(11)
  @MaxLength(14)
  document: string;
}
