import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestRecoverPasswordCodeDto {
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  email: string;
}
