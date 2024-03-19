import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { environmentVariables } from 'src/config/environmentVariables';
import { UsersService } from 'src/modules/users/users.service';
import { AutenticatedJwtUser } from 'src/types/modules/auth/signinJwtPayload';
import { RolePermissionName } from 'src/types/roles/rolePermission';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { id } = await this.jwtService.verifyAsync(token, {
        secret: environmentVariables.JWT_SECRET,
      });

      const user = await this.usersService.findById({
        id,
        mode: 'ensureExistence',
      });

      const autenticatedUser: AutenticatedJwtUser = {
        id: user.id,
        role:  user.role,
        getPermissionByName: (name: RolePermissionName) => user.role?.permissions?.find(permission => permission.name === name),
      };

      request['user'] = autenticatedUser;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
