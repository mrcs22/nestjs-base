import { HttpStatus, Injectable } from '@nestjs/common';
import AppException from 'src/exceptionFilters/AppException/AppException';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AbstractUsersRepository } from './repositories/abstract.users.repository';
import { User } from './entities/user.entity';
import { ListAllUsersDto } from './dto/listAllUsers.dto';
import {
  FindServiceMode,
  FindServiceResult,
} from 'src/types/modules/findServiceMode';
import { hash } from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: AbstractUsersRepository,
    private rolesService: RolesService,
    private mailService: MailService
  ) { }

  async create(createUserDto: CreateUserDto) {
    await this.findByName({
      name: createUserDto.name,
      mode: 'ensureNonExistence',
    });

    const user = new User();
    user.fromDto(createUserDto);

    user.role = await this.rolesService.findById({
      id: createUserDto.role.id,
      mode: 'ensureExistence',
    })  

    const temporaryPassword = await this.addTemporaryPassword(user);
    const createdUser = await this.userRepository.create(user);

    this.mailService.sendTemporyPasswordMail({
      to: user.email,
      name: user.name,
      temporaryPassword,
    });

    return createdUser;
  }

  listAll<Simplified extends boolean>(
    params: ListAllUsersDto,
    simplified: Simplified,
  ) {
    return this.userRepository.listAll(params, simplified);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById({ id, mode: 'ensureExistence' });

    const existingUserWithName = await this.userRepository.findByName(
      updateUserDto.name,
    );

    if (existingUserWithName && existingUserWithName.id !== id) {
      throw new AppException(
        `Existe outro cadastro come este nome`,
        HttpStatus.CONFLICT,
      );
    }

    user.fromDto(updateUserDto);
    user.role = await this.rolesService.findById({
      id: updateUserDto.role.id,
      mode: 'ensureExistence',
    })

    return await this.userRepository.update(user);
  }

  async remove(id: string) {
    await this.findById({
      id,
      mode: 'ensureExistence',
    });

    await this.userRepository.remove(id);
  }

  async findByName<Mode extends FindServiceMode>(params: {
    name: string;
    mode?: Mode;
  }) {
    const { name, mode = 'default' } = params;
    const existingUser = await this.userRepository.findByName(name);

    if (existingUser && mode === 'ensureNonExistence') {
      throw new AppException(
        `Existe outro cadastro come este nome`,
        HttpStatus.CONFLICT,
      );
    }

    if (!existingUser && mode === 'ensureExistence') {
      throw new AppException(
        `Nenhum cadastro com esse nome foi encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async findById<Mode extends FindServiceMode>(params: {
    id: string;
    mode?: Mode;
  }) {
    const { id, mode = 'default' } = params;
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser && mode === 'ensureExistence') {
      throw new AppException(`Não encontrado`, HttpStatus.NOT_FOUND);
    }

    if (existingUser && mode === 'ensureNonExistence') {
      throw new AppException(
        `Existe outro cadastro com este id`,
        HttpStatus.CONFLICT,
      );
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async findByEmail<Mode extends FindServiceMode>(params: {
    email: string;
    mode?: Mode;
    withPassword?: boolean;
  }) {
    const { email, mode = 'default', withPassword } = params;
    const existingUser = await this.userRepository.findByEmail({
      email,
      withPassword,
    });

    if (existingUser && mode === 'ensureNonExistence') {
      throw new AppException('Já existe um colaborador com este email', 409);
    }

    if (!existingUser && mode === 'ensureExistence') {
      throw new AppException('Colaborador não encontrado', 404);
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async updatePassword({ id, password }: { id: string; password: string }) {
    const user = await this.findById({
      id,
      mode: 'ensureExistence',
    });

    user.password = await hash(password, 12);

    await this.userRepository.update(user);
  }

  private async addTemporaryPassword(
    user: User,
    passwordLength = 8,
  ) {
    const temporaryPassword = crypto
      .randomBytes(4)
      .toString('hex')
      .substring(0, passwordLength);

    user.password = await hash(temporaryPassword, 12);
    return temporaryPassword;
  }
}
