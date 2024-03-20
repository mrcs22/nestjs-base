import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { $Entity$ } from '../../entities/$entity-kebab$.entity';
import { Abstract$Entities$Repository } from '../abstract.$entities-kebab$.repository';
import { ListAll$Entities$Dto } from '../../dto/list-$entities-kebab$.dto';
import { Listed$Entity$Dto } from '../../dto/listed-$entity-kebab$.dto';
import { RepositoryListingResult } from 'src/types/modules/repository-listing-mode';

@Injectable()
export class $Entities$TypeormRepository extends Abstract$Entities$Repository {
  private $entities$Repository: Repository<$Entity$>;
  private entityManager: EntityManager;

  constructor(dataSource: DataSource) {
    super();

    this.entityManager = dataSource.createEntityManager();
    this.$entities$Repository = this.entityManager.getRepository($Entity$);
  }

  public async create($entity$: $Entity$) {
    return await this.$entities$Repository.save($entity$);
  }

  async listAll<Simplified extends boolean>(
    { page, limit, order = 'desc', query, isActive }: ListAll$Entities$Dto,
    simplified: Simplified,
  ) {
    const $entity$Qb = this.$entities$Repository.createQueryBuilder('$entity$');

    if (isActive !== undefined) {
      $entity$Qb.andWhere('$entity$.isActive = :isActive', {
        isActive,
      });
    }

    if (query) {
      $entity$Qb.andWhere('$entity$.name LIKE :query', {
        query: `%${query}%`,
      });
    }

    if (page && limit) {
      $entity$Qb.skip((page - 1) * limit);
      $entity$Qb.take(limit);
    }

    const listingOrder = order.toUpperCase() as 'ASC' | 'DESC';

    $entity$Qb.orderBy('$entity$.createdAt', listingOrder);

    let selectFields = ['$entity$.id', '$entity$.name', '$entity$.createdAt'];
    if (!simplified) {
      selectFields = ['$entity$'];
    }

    $entity$Qb.select(selectFields);
    return $entity$Qb.getManyAndCount() as unknown as RepositoryListingResult<
      Listed$Entity$Dto,
      Simplified
    >;
  }

  findByName(name: string): Promise<$Entity$ | null> {
    return this.$entities$Repository.findOne({
      where: {
        name: name,
      },
    });
  }

  findById(id: string): Promise<$Entity$ | null> {
    return this.$entities$Repository.findOne({
      where: {
        id,
      },
    });
  }

  update($entity$: $Entity$): Promise<$Entity$> {
    return this.$entities$Repository.save($entity$);
  }

  async remove(id: string): Promise<void> {
    await this.$entities$Repository.softDelete(id);
  }
}
