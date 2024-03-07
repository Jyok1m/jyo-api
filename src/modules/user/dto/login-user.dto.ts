import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsString()
  @Length(1, 50) // This sets a minimum length of 1 and a maximum of 50 characters
  username?: string; // Optional - can either be username or email

  @IsEmail()
  email?: string; // Optional - can either be username or email

  @IsString()
  password: string; // No need for regex validation here
}
