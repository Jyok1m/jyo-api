import { IsEmail, IsString, Length, MinLength, Matches } from "class-validator";

export class SignUpDto {
  @IsString()
  @Length(1, 50) // This sets a minimum length of 1 and a maximum of 50 characters
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  })
  password: string;
}
