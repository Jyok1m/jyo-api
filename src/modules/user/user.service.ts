import { Injectable, ConflictException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  // Import du modèle user
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Méthode pour créer un utilisateur
  async createUser(req: CreateUserDto): Promise<User> {
    // Recherche si le user existe
    const existingUser = await this.userModel.findOne({ email: req.email });
    if (existingUser) throw new ConflictException("User already exists.");

    // Création du user
    const createdUser = new this.userModel(req);
    return createdUser.save();
  }
}
