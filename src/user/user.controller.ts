import { Controller, Post, Body } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { User } from "src/schemas/user.schema";

@Controller("user")
export class UserController {
  // Import user service
  constructor(private readonly userService: UserService) {}

  @Post() // Post handler
  async createUser(@Body() req: CreateUserDto): Promise<User> {
    return this.userService.createUser(req);
  }
}
