import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";

import { Signout } from "./interfaces/Signout.interface";
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
  async createUser(@Body() req: SignUpDto): Promise<AuthResult> {
    return this.userService.createUser(req);
  }

  // Signin
  @Post("/sign-in")
  async loginUser(@Body() req: SignInDto): Promise<AuthResult> {
    return this.userService.loginUser(req);
  }

  // Signout
  @Post("/sign-out")
  async signout(@Body() req: SignOutDto): Promise<Signout> {
    return { success: true, message: "User signed-out successfully." };
  }
}
