import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 50) // This sets a minimum length of 1 and a maximum of 50 characters
  firstname: string;
}
