import { Injectable, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  // Import du modèle user
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
      if (e instanceof ConflictException) {
        throw e;
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }
}
