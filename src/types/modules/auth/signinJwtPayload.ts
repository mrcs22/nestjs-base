import { Permission } from 'src/modules/roles/entities/permissions.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RolePermissionName } from 'src/types/roles/rolePermission';

type AutenticatedJwtUser = {
  id: string;
  role: Role;
  getPermissionByName: (name: RolePermissionName) => Permission | undefined;
};

export { AutenticatedJwtUser };
