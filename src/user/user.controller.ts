import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";

import { Signout } from "./interfaces/Signout.interface";
import { AuthResult } from "./interfaces/AuthResult.interface";

import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { SignoutUserDto } from "./dto/signout-user.dto";

@Controller("user")
export class UserController {
  // Import user service
  constructor(private readonly userService: UserService) {}

  // Sign-up
  @Post("/sign-up")
  async createUser(@Body() req: CreateUserDto): Promise<AuthResult> {
    return this.userService.createUser(req);
  }

  // Signin
  @Post("/sign-in")
  async loginUser(@Body() req: LoginUserDto): Promise<AuthResult> {
    return this.userService.loginUser(req);
  }

  // Signout
  @Post("/sign-out")
  async signout(@Body() req: SignoutUserDto): Promise<Signout> {
    return { success: true, message: "User signed-out successfully." };
  }
}
