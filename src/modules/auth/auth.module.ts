import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../users/users.module";
import { RolesModule } from "../roles/roles.module";
import { JwtModule } from "@nestjs/jwt";
import { environmentVariables } from "src/config/environment-variables";

@Module({
  imports: [
    RolesModule,
    JwtModule.register({
      global: true,
      secret: environmentVariables.JWT_SECRET,
      signOptions: { expiresIn: environmentVariables.JWT_EXPIRES },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
