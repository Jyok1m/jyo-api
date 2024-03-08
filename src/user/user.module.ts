import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "schemas/user.schema";
import { JwtModule } from "src/jwt/jwt.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), JwtModule],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {}
