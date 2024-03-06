import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";

@Injectable()
export class UserService {
  // Import du modèle User
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
}
