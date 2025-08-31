import { RepositoryListingResult } from "src/types/modules/repository-listing-mode";
import { ListAllRolesDto } from "../dto/list-roles.dto";
import { ListedRoleDto } from "../dto/listed-role.dto";
import { Role } from "../entities/role.entity";

export abstract class AbstractRolesRepository {
  abstract create(createRoleDto: Role): Promise<Role>;
  abstract findById(id: string): Promise<Role | null>;
  abstract findByName(name: string): Promise<Role | null>;
  abstract update(role: Role): Promise<Role>;
  abstract remove(id: string): Promise<void>;
  abstract listAll<Simplified extends boolean>(
    ListAllRoleDto: ListAllRolesDto,
    simplified: Simplified,
  ): Promise<RepositoryListingResult<ListedRoleDto, Simplified>>;
}
