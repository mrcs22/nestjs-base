import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Role } from '../../entities/role.entity';
import { AbstractRolesRepository } from '../abstract.roles.repository';
import { ListAllRolesDto } from '../../dto/list-roles.dto';
import { ListedRoleDto } from '../../dto/listed-role.dto';
import { RepositoryListingResult } from 'src/types/modules/repository-listing-mode';

@Injectable()
export class RolesTypeormRepository extends AbstractRolesRepository {
  private rolesRepository: Repository<Role>;
  private entityManager: EntityManager;

  constructor(dataSource: DataSource) {
    super();

    this.entityManager = dataSource.createEntityManager();
    this.rolesRepository = this.entityManager.getRepository(Role);
  }

  public async create(role: Role) {
    return await this.rolesRepository.save(role);
  }

  async listAll<Simplified extends boolean>(
    { page, limit, order = 'desc', query, isActive }: ListAllRolesDto,
    simplified: Simplified,
  ) {
    const roleQb = this.rolesRepository.createQueryBuilder('role');

    if (isActive !== undefined) {
      roleQb.andWhere('role.isActive = :isActive', {
        isActive,
      });
    }

    if (query) {
      roleQb.andWhere('role.name LIKE :query', {
        query: `%${query}%`,
      });
    }

    if (page && limit) {
      roleQb.skip((page - 1) * limit);
      roleQb.take(limit);
    }

    const listingOrder = order.toUpperCase() as 'ASC' | 'DESC';

    roleQb.orderBy('role.createdAt', listingOrder);

    let selectFields = ['role.id', 'role.name', 'role.createdAt'];
    if (!simplified) {
      selectFields = ['role'];
    }

    roleQb.select(selectFields);
    return roleQb.getManyAndCount() as unknown as RepositoryListingResult<
      ListedRoleDto,
      Simplified
    >;
  }

  findByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  findById(id: string): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    await this.rolesRepository.softDelete(id);
  }
}
