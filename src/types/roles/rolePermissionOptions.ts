export type RolePermissionOptions = {
  create: boolean | null;
  read: boolean | null;
  update: boolean | null;
  delete: boolean | null;
};

export type RolePermissionOption = keyof RolePermissionOptions;

export interface IRolePemissionOptions extends RolePermissionOptions {}
