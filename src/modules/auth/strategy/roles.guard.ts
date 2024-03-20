import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { RolePermissionName } from 'src/types/roles/role-permission';
import { RolePermissionOption } from 'src/types/roles/role-permission-options';
import { AutenticatedJwtUser } from 'src/types/modules/auth/signin-jwt-payload';
import { IS_PUBLIC_KEY } from './jwt-auth.guard';

export const PERMISSION_KEY = 'requiredPermission';

export interface IRequiredPermission {
  name: RolePermissionName;
  option: RolePermissionOption;
}

export const RequiredPermission = (
  name: RolePermissionName,
  option: RolePermissionOption,
) => SetMetadata(PERMISSION_KEY, { name, option });

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermission =
      this.reflector.getAllAndOverride<IRequiredPermission>(PERMISSION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredPermission || isPublic) return true;

    const user = context.switchToHttp().getRequest()
      .user as AutenticatedJwtUser;

    const userRequiredPermission = user.getPermissionByName(
      requiredPermission.name,
    )

    if (!userRequiredPermission) {
      return false;
    }
    
    return Boolean(userRequiredPermission[
      requiredPermission.option
    ]);
  }
}
