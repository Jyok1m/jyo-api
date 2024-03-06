import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// Création du type
export type UserDocument = HydratedDocument<User>;

// Définition du schéma
@Schema()
// Export de la classe TS + propriétés TS
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  firstname: string;
}

// Création du modèle users dans mongoDB
export const UserSchema = SchemaFactory.createForClass(User);
