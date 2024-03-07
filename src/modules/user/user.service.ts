import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
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

  async loginUser(req: LoginUserDto): Promise<any> {
    try {
      // Recherche si le user existe
      const user = await this.userModel.findOne({ $or: [{ email: req.identifier }, { username: req.identifier }] });
      if (!user) throw new NotFoundException("User not found");

      // Vérfication du mot de passe
      const isMatch = await bcrypt.compare(req.password, user.password);
      if (!isMatch) throw new BadRequestException("Incorrect password");

      // Génération du JSON web token
      const token = "blabla";

      // Sauvegarde du token en DB
  

      return { token };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }
}
