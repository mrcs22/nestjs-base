import { faker } from "@faker-js/faker";
import { CreateRoleDto } from "../../dto/create-role.dto";
import { UpdateRoleDto } from "../../dto/update-role.dto";
import { Role } from "../../entities/role.entity";
import { ListedRoleDto } from "../../dto/listed-role.dto";

export class CreateroleDtoFactory {
  static generate(): CreateRoleDto {
    const createroleDto = new CreateRoleDto();

    createroleDto.name = faker.lorem.words();
    createroleDto.isActive = faker.datatype.boolean();
    createroleDto.notes = faker.lorem.words();

    return createroleDto;
  }
}

export class UpdateroleDtoFactory {
  static generate(): UpdateRoleDto {
    const updateroleDto = new UpdateRoleDto();

    updateroleDto.name = faker.lorem.words();
    updateroleDto.isActive = faker.datatype.boolean();
    updateroleDto.notes = faker.lorem.words();

    return updateroleDto;
  }
}

export class RoleFactory {
  static generate() {
    const role = new Role();
    role.id = faker.string.uuid();
    role.name = faker.lorem.words();
    role.isActive = faker.datatype.boolean();
    role.notes = faker.lorem.words();
    role.createdAt = faker.date.recent();
    role.updatedAt = faker.date.recent();

    return role;
  }

  static generateListed() {
    const role = this.generate();

    const listedrole: ListedRoleDto = {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt.toISOString(),
      isActive: role.isActive,
      notes: role.notes,
    };

    return listedrole;
  }

  static generateManyListed(amount = faker.number.int(5)) {
    return Array.from({ length: amount }, () => this.generateListed());
  }
}
