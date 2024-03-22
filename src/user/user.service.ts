import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { JwtService } from "src/jwt/jwt.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

import { User } from "schemas/user.schema";
import { AuthResult } from "./interfaces/AuthResult.interface";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Import du modèle user
    private jwtService: JwtService,
  ) {}

  async createUser(req: CreateUserDto): Promise<AuthResult> {
    try {
      const userExists = await this.userModel.findOne({ email: req.email });
      if (userExists) throw new ConflictException("User already exists.");

      const hash = await bcrypt.hash(req.password, 10);
      const userObj = new this.userModel({ ...req, password: hash });

      const genResult = this.jwtService.generate(userObj._id.toString());
      if (!(genResult.success && genResult.token)) throw new InternalServerErrorException(genResult.error);

      userObj.token = genResult.token;
      const savedUser = await userObj.save();

      return { success: true, token: savedUser.token };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(req: LoginUserDto): Promise<AuthResult> {
    try {
      const existingUser = await this.userModel
        .findOne({ $or: [{ email: req.identifier }, { username: req.identifier }] })
        .select("token password");
      if (!existingUser) throw new NotFoundException("User not found.");

      const isPasswordMatch = await bcrypt.compare(req.password, existingUser.password);
      if (!isPasswordMatch) throw new BadRequestException("Incorrect password.");

      const checkResult = this.jwtService.verify(existingUser.token);

      if (checkResult.success) {
        return { success: true, token: existingUser.token };
      } else {
        const genResult = this.jwtService.generate(existingUser._id.toString());
        if (!(genResult.success && genResult.token)) throw new InternalServerErrorException(genResult.error);

        await this.userModel.findByIdAndUpdate(existingUser._id.toString(), { token: genResult.token });

        return { success: true, token: genResult.token };
      }
    } catch (e) {
      throw e;
    }
  }
}
