import { HttpStatus, Injectable } from '@nestjs/common';
import AppException from 'src/exception-filters/app-exception/app-exception';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AbstractRolesRepository } from './repositories/abstract.roles.repository';
import { Role } from './entities/role.entity';
import { ListAllRolesDto } from './dto/list-roles.dto';
import {
  FindServiceMode,
  FindServiceResult,
} from 'src/types/modules/find-service-mode';

@Injectable()
export class RolesService {
  constructor(private roleRepository: AbstractRolesRepository) { }

  async create(createRoleDto: CreateRoleDto) {
    await this.findByName({
      name: createRoleDto.name,
      mode: 'ensureNonExistence',
    });

    const role = new Role();
    role.fromDto(createRoleDto);


    const createdRole = await this.roleRepository.create(role);
    return createdRole;
  }

  listAll<Simplified extends boolean>(
    params: ListAllRolesDto,
    simplified: Simplified,
  ) {
    return this.roleRepository.listAll(params, simplified);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findById({ id, mode: 'ensureExistence' });

    const existingRoleWithName = await this.roleRepository.findByName(
      updateRoleDto.name
    );

    if (existingRoleWithName && existingRoleWithName.id !== id) {
      throw new AppException(
        `Já existe um cargo com este nome`,
        HttpStatus.CONFLICT,
      );
    }

    role.fromDto(updateRoleDto);
    return await this.roleRepository.update(role);
  }

  async remove(id: string) {
    await this.findById({
      id,
      mode: 'ensureExistence',
    });

    await this.roleRepository.remove(id);
  }

  async findByName<Mode extends FindServiceMode>(params: {
    name: string;
    mode?: Mode;
  }) {
    const { name, mode = 'default' } = params;
    const existingRole = await this.roleRepository.findByName(name);

    if (existingRole && mode === 'ensureNonExistence') {
      throw new AppException(
        `Já existe um cargo com este nome`,
        HttpStatus.CONFLICT,
      );
    }

    if (!existingRole && mode === 'ensureExistence') {
      throw new AppException(
        `Nenhum cargo com esse nome foi encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    if(!existingRole?.isActive && mode === 'ensureActiveExistence') {
      throw new AppException(
        `Cargo inativo`,
        HttpStatus.CONFLICT,
      );
    }

    return existingRole as FindServiceResult<Role, Mode>;
  }

  async findById<Mode extends FindServiceMode>(params: {
    id: string;
    mode?: Mode;
  }) {
    const { id, mode = 'default' } = params;
    const existingRole = await this.roleRepository.findById(id);

    if (!existingRole && mode === 'ensureExistence') {
      throw new AppException(`Cargo não encontrado`, HttpStatus.NOT_FOUND);
    }

    if (existingRole && mode === 'ensureNonExistence') {
      throw new AppException(
        `Existe outro cargo com este id`,
        HttpStatus.CONFLICT,
      );
    }

    return existingRole as FindServiceResult<Role, Mode>;
  }
}
