import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";

import { User } from "schemas/user.schema";
import { Login } from "./interfaces/Login.interface";

import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("user")
export class UserController {
  // Import user service
  constructor(private readonly userService: UserService) {}

  // Sign-up
  @Post("/signup")
  async createUser(@Body() req: CreateUserDto): Promise<User> {
    return this.userService.createUser(req);
  }

  // Signin
  @Post("/signin")
  async loginUser(@Body() req: LoginUserDto): Promise<Login> {
    return this.userService.loginUser(req);
  }
}
