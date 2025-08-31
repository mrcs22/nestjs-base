import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class Create$Entity$Dto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
