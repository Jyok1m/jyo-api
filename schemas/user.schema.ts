import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// Création du type
export type UserDocument = HydratedDocument<User>;

// Définition du schéma
@Schema({ timestamps: true })
// Export de la classe TS + propriétés TS
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  token: string;
}

// Création du modèle users dans mongoDB
export const UserSchema = SchemaFactory.createForClass(User);
