import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";

import { SignOutResult } from "./interfaces/SignOutResult.interface";
import { AuthResult } from "./interfaces/AuthResult.interface";

import { SignUpDto } from "./dto/SignUp.dto";
import { SignInDto } from "./dto/SignIn.dto";
import { SignOutDto } from "./dto/SignOut.dto";

@Controller("user")
export class UserController {
  // Import user service
  constructor(private readonly userService: UserService) {}

  // Sign-up
  @Post("/sign-up")
  async signUp(@Body() req: SignUpDto): Promise<AuthResult> {
    return this.userService.signUp(req);
  }

  // Signin
  @Post("/sign-in")
  async signIn(@Body() req: SignInDto): Promise<AuthResult> {
    return this.userService.signIn(req);
  }

  // Signout
  @Post("/sign-out")
  async signOut(@Body() req: SignOutDto): Promise<SignOutResult> {
    return this.userService.signOut(req);
  }
}
