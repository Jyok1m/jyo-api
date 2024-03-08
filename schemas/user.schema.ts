import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// Création du type
export type UserDocument = HydratedDocument<User>;

// Définition du schéma
@Schema({ timestamps: true })
// Export de la classe TS + propriétés TS
export class User {
  @Prop({ unique: true, required: true })
  uuid: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: false })
  webToken?: string;

  @Prop({ required: false, default: false })
  isConnected?: boolean;
}

// Création du modèle users dans mongoDB
export const UserSchema = SchemaFactory.createForClass(User);
