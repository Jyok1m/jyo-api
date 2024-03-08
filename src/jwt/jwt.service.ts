import { ConfigService } from "@nestjs/config";
import { BadRequestException, InternalServerErrorException, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { JwtVerify } from "./interfaces/JwtVerify.interface";
import { JwtGenerate } from "./interfaces/JwtGenerate.interface";

@Injectable()
export class JwtService {
  private jwtSecretKey: string;
  private jwtExpiration: string;

  constructor(private configService: ConfigService) {
    this.jwtSecretKey = this.configService.get<string>("JWT_SECRET_KEY") || "";
    this.jwtExpiration = this.configService.get<string>("JWT_EXPIRATION") || "1d";
  }

  verify(token: string): JwtVerify {
    try {
      const secretKey = this.jwtSecretKey;
      if (secretKey.length === 0) throw new BadRequestException("No secret key provided. Abort.");

      const decoded = jwt.verify(token, secretKey);
      if (typeof decoded === "string") {
        throw new BadRequestException("Invalid token");
      }

      const userId = (decoded as JwtPayload).userId;
      if (!userId) {
        throw new BadRequestException("UserId not found in token");
      }

      return { success: true, userId };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  generate(userId: string): JwtGenerate {
    try {
      const expirationDate = this.jwtExpiration;
      const secretKey = this.jwtSecretKey;
      const token = jwt.sign({ userId }, secretKey, { expiresIn: expirationDate });

      if (!token) {
        throw new InternalServerErrorException("Token not generated");
      } else {
        return { success: true, token };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}
