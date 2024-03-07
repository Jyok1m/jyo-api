import { IsString } from "class-validator";

export class LoginUserDto {
  @IsString()
  identifier: string; // Optional - can either be username or email

  @IsString()
  password: string; // No need for regex validation here
}
