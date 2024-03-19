import { RepositoryListingResult } from 'src/types/modules/RepositoryListingMode';
import { ListAllUsersDto } from '../dto/listAllUsers.dto';
import { ListedUserDto } from '../dto/listedUser.dto';
import { User } from '../entities/user.entity';

export abstract class AbstractUsersRepository {
  abstract create(createUserDto: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByName(name: string): Promise<User | null>;
  abstract findByEmail(params: {
    email: string;
    withPassword?: boolean;
  }): Promise<User | null>;
  abstract update(user: User): Promise<User>;
  abstract remove(id: string): Promise<void>;
  abstract listAll<Simplified extends boolean>(
    ListAllUserDto: ListAllUsersDto,
    simplified: Simplified,
  ): Promise<RepositoryListingResult<ListedUserDto, Simplified>>;
}
