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

import { SignUpDto } from "./dto/SignUp.dto";
import { SignInDto } from "./dto/SignIn.dto";
import { SignOutDto } from "./dto/SignOut.dto";

import { User } from "schemas/user.schema";
import { AuthResult } from "./interfaces/AuthResult.interface";
import { SignOutResult } from "./interfaces/SignOutResult.interface";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Import du modèle user
    private jwtService: JwtService,
  ) {}

  async signUp(req: SignUpDto): Promise<AuthResult> {
    try {
      const userExists = await this.userModel.findOne({ email: req.email });
      if (userExists) throw new ConflictException("User already exists.");

      const hash = await bcrypt.hash(req.password, 10);
      const userObj = new this.userModel({ ...req, password: hash });

      const genResult = this.jwtService.generate(userObj._id.toString());
      if (!(genResult.success && genResult.token)) throw new InternalServerErrorException(genResult.error);

      userObj.token = genResult.token;
      await userObj.save();

      return { success: true, token: genResult.token };
    } catch (error) {
      throw error;
    }
  }

  async signIn(req: SignInDto): Promise<AuthResult> {
    try {
      const existingUser = await this.userModel
        .findOne({ $or: [{ email: req.identifier }, { username: req.identifier }] })
        .select("token password");
      if (!existingUser) throw new NotFoundException("User not found.");

      const isPasswordMatch = await bcrypt.compare(req.password, existingUser.password);
      if (!isPasswordMatch) throw new BadRequestException("Incorrect password.");

      let token = "";

      if (existingUser.token && this.jwtService.verify(existingUser.token).success) {
        token = existingUser.token;
      } else {
        const genResult = this.jwtService.generate(existingUser._id.toString());
        if (!(genResult.success && genResult.token)) throw new InternalServerErrorException(genResult.error);
        await this.userModel.findByIdAndUpdate(existingUser._id.toString(), { token: genResult.token });
        token = genResult.token;
      }

      return { success: true, token };
    } catch (e) {
      throw e;
    }
  }

  async signOut(req: SignOutDto): Promise<SignOutResult> {
    try {
      const existingUser = await this.userModel.findOne({ token: req.token });
      if (!existingUser) throw new NotFoundException("User not found or already signed-out.");

      const tokenCheck = this.jwtService.verify(req.token);
      if (!tokenCheck.success) throw new BadRequestException("Invalid token.");

      await this.userModel.findByIdAndUpdate(existingUser._id.toString(), { token: "" });

      return { success: true, message: "User signed-out successfully." };
    } catch (e) {
      throw e;
    }
  }
}
