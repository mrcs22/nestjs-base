import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../entities/user.entity';
import { ListedUserDto } from '../../dto/listed-user.dto';
import { CreateroleDtoFactory, RoleFactory } from 'src/modules/roles/tests/factory/role';

export class CreateuserDtoFactory {
  static generate(): CreateUserDto {
    const createuserDto = new CreateUserDto();

    createuserDto.name = faker.lorem.words();
    createuserDto.document = faker.lorem.words();
    createuserDto.isActive = faker.datatype.boolean();
    createuserDto.notes = faker.lorem.words();

    const role = RoleFactory.generate();
    createuserDto.role = {
      id: role.id,
      name: role.name,
    }

    return createuserDto;
  }
}

export class UpdateuserDtoFactory {
  static generate(): UpdateUserDto {
    const updateuserDto = new UpdateUserDto();

    updateuserDto.name = faker.lorem.words();
    updateuserDto.isActive = faker.datatype.boolean();
    updateuserDto.document = faker.lorem.words();
    updateuserDto.notes = faker.lorem.words();

    const role = RoleFactory.generate();
    updateuserDto.role = {
      id: role.id,
      name: role.name,
    }

    return updateuserDto;
  }
}

export class UserFactory {
  static generate() {
    const user = new User();
    user.id = faker.string.uuid();
    user.name = faker.lorem.words();
    user.document = faker.lorem.words();
    user.isActive = faker.datatype.boolean();
    user.notes = faker.lorem.words();
    user.createdAt = faker.date.recent();
    user.updatedAt = faker.date.recent();

    return user;
  }

  static generateListed() {
    const user = this.generate();

    const listeduser: ListedUserDto = {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      isActive: user.isActive,
      notes: user.notes,
    };

    return listeduser;
  }

  static generateManyListed(amount = faker.number.int(5)) {
    return Array.from({ length: amount }, () => this.generateListed());
  }
}
