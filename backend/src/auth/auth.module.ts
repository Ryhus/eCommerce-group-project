import { Module } from "@nestjs/common";
import { CartsModule } from "../carts/carts.module.js";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

@Module({ imports: [UsersModule, CartsModule], controllers: [AuthController], providers: [AuthService] })
export class AuthModule {}
