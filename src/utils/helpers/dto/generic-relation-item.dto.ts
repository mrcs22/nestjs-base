import { IsNotEmpty, IsString } from "class-validator";

export class GenericRelationItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsString()
  name: string;
}
