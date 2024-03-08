import { IsString } from "class-validator";

export class LoginUserDto {
  @IsString()
  identifier: string; // Can either be username or email

  @IsString()
  password: string; // No need for regex validation here
}
