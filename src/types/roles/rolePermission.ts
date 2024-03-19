import { RolePermissionOptions } from './rolePermissionOptions';

export const iterableRolePermissionNames = [
  'users', 'roles'
] as const;

export type RolePermissionName = (typeof iterableRolePermissionNames)[number];

export const RolePermissionNameEnum = Object.freeze(
  iterableRolePermissionNames.reduce(
    (acc, name) => {
      acc[name] = name;
      return acc;
    },
    {} as Record<RolePermissionName, RolePermissionName>
  )  
);

export type RolePermissions = {
  [key in (typeof iterableRolePermissionNames)[number]]: RolePermissionOptions;
};

export const iterableRoleReadonlyPermissionNames: RolePermissionName[] = [] as const;

export type ReadonlyRolePermissionName =
  (typeof iterableRoleReadonlyPermissionNames)[number];

export interface IRolePermissions extends RolePermissions {}
