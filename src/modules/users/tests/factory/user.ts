import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../entities/user.entity';
import { ListedUserDto } from '../../dto/listed-user.dto';
import { CreateroleDtoFactory, RoleFactory } from 'src/modules/roles/tests/factory/role';

export class CreateuserDtoFactory {
  static generate(): CreateUserDto {
    const createuserDto = new CreateUserDto();

    const role = RoleFactory.generate();

    createuserDto.data = {
      name: faker.lorem.words(),
      document: faker.lorem.words(),
      isActive: faker.datatype.boolean(),
      notes: faker.lorem.words(),
      email: faker.internet.email(),
      role
    }

    return createuserDto;
  }
}

export class UpdateuserDtoFactory {
  static generate(): UpdateUserDto {
    const updateuserDto = new UpdateUserDto();

    const role = RoleFactory.generate();

    updateuserDto.data = {
      name: faker.lorem.words(),
      document: faker.lorem.words(),
      isActive: faker.datatype.boolean(),
      notes: faker.lorem.words(),
      email: faker.internet.email(),
      role
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
