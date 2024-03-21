import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { AbstractUsersRepository } from '../abstract.users.repository';
import { ListAllUsersDto } from '../../dto/list-users.dto';
import { ListedUserDto } from '../../dto/listed-user.dto';
import { RepositoryListingResult } from 'src/types/modules/repository-listing-mode';

@Injectable()
export class UsersTypeormRepository extends AbstractUsersRepository {
  private usersRepository: Repository<User>;
  private entityManager: EntityManager;

  constructor(dataSource: DataSource) {
    super();

    this.entityManager = dataSource.createEntityManager();
    this.usersRepository = this.entityManager.getRepository(User);
  }

  public async create(user: User) {
    return await this.usersRepository.save(user);
  }

  async listAll<Simplified extends boolean>(
    { page, limit, order = 'desc', query, isActive }: ListAllUsersDto,
    simplified: Simplified,
  ) {
    const userQb = this.usersRepository.createQueryBuilder('user');

    if (isActive !== undefined) {
      userQb.andWhere('user.isActive = :isActive', {
        isActive,
      });
    }

    if (query) {
      userQb.andWhere('user.name LIKE :query', {
        query: `%${query}%`,
      });
    }

    if (page && limit) {
      userQb.skip((page - 1) * limit);
      userQb.take(limit);
    }

    const listingOrder = order.toUpperCase() as 'ASC' | 'DESC';

    userQb.orderBy('user.createdAt', listingOrder);

    let selectFields = ['user.id', 'user.name', 'user.createdAt'];
    if (!simplified) {
      selectFields = ['user'];
    }

    userQb.select(selectFields);
    return userQb.getManyAndCount() as unknown as RepositoryListingResult<
      ListedUserDto,
      Simplified
    >;
  }

  findByName(name: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        name: name,    
      },
      relations: ['role'],
    });
  }

  findByEmail({
    email,
    withPassword,
  }: {
    email: string;
    withPassword?: boolean;
  }): Promise<User | null> {
    const userQb = this.usersRepository.createQueryBuilder('user');
    userQb.where('user.email = :email', { email });
    userQb.leftJoinAndSelect('user.role', 'role');
    userQb.leftJoinAndSelect('role.permissions', 'permissions');

    if (withPassword) {
      userQb.addSelect('user.password');
    }

    return userQb.getOne();
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: ['role'],
    });
  }

  update(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
