import { IsString } from "class-validator";

export class SignoutUserDto {
  @IsString()
  token: string;
}
