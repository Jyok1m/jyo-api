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
import { Login } from "./interfaces/Login.interface";

import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Import du modèle user
    private jwtService: JwtService,
  ) {}

  // Méthode pour créer un utilisateur
  async createUser(req: CreateUserDto): Promise<User> {
    try {
      // Recherche si le user existe
      const existingUser = await this.userModel.findOne({ email: req.email });
      if (existingUser) throw new ConflictException("User already exists.");

      // Generate UUID
      const newUserUid: string = uuidv4();

      // Hash password
      const hashedPassword = await bcrypt.hash(req.password, 10);

      // Construct object
      const newUser: User = { ...req, uuid: newUserUid, password: hashedPassword };

      // Création du user
      const createdUser = new this.userModel(newUser);
      return createdUser.save();
    } catch (e) {
      throw e;
    }
  }

  // Méthode pour login un utilisateur
  async loginUser(req: LoginUserDto): Promise<Login> {
    try {
      // Recherche si le user existe
      const user = await this.userModel
        .findOne({ $or: [{ email: req.identifier }, { username: req.identifier }] })
        .select("webToken password");
      if (!user) throw new NotFoundException("User not found.");

      // Vérfication du mot de passe
      const isMatch = await bcrypt.compare(req.password, user.password);
      if (!isMatch) throw new BadRequestException("Incorrect password.");

      // Token handling
      let isTokenValid = false;
      let token: string = "";

      // If a user has webToken, verify it.
      if (user.webToken) {
        const checkResult = this.jwtService.verify(user.webToken);
        if (checkResult.success) {
          isTokenValid = true;
          token = user.webToken;
        } else {
          const genResult = this.jwtService.generate(user._id.toString());
          if (genResult.success && genResult.token) {
            isTokenValid = true;
            token = genResult.token;
          } else {
            throw new InternalServerErrorException(genResult.error);
          }
        }
      }

      if (!isTokenValid) {
        const genResult = this.jwtService.generate(user._id.toString());
        if (genResult.success && genResult.token) {
          token = genResult.token;
        } else {
          throw new InternalServerErrorException(genResult.error);
        }
      }

      // Save token
      await this.userModel.findByIdAndUpdate(user._id.toString(), { webToken: token });

      return { success: true, token };
    } catch (e) {
      throw e;
    }
  }
}
