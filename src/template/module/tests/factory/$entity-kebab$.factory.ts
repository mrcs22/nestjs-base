import { faker } from '@faker-js/faker';
import { Create$Entity$Dto } from '../../dto/create-$entity-kebab$.dto';
import { Update$Entity$Dto } from '../../dto/update-$entity-kebab$.dto';
import { $Entity$ } from '../../entities/$entity-kebab$.entity';
import { Listed$Entity$Dto } from '../../dto/listed-$entity-kebab$.dto';

export class Create$Entity$DtoFactory {
  static generate(): Create$Entity$Dto {
    const create$entity$Dto = new Create$Entity$Dto();

    create$entity$Dto.name = faker.lorem.words();
    create$entity$Dto.isActive = faker.datatype.boolean();
    create$entity$Dto.notes = faker.lorem.words();

    return create$entity$Dto;
  }
}

export class Update$Entity$DtoFactory {
  static generate(): Update$Entity$Dto {
    const update$entity$Dto = new Update$Entity$Dto();

    update$entity$Dto.name = faker.lorem.words();
    update$entity$Dto.isActive = faker.datatype.boolean();
    update$entity$Dto.notes = faker.lorem.words();

    return update$entity$Dto;
  }
}

export class $Entity$Factory {
  static generate() {
    const $entity$ = new $Entity$();
    $entity$.id = faker.string.uuid();
    $entity$.name = faker.lorem.words();
    $entity$.isActive = faker.datatype.boolean();
    $entity$.notes = faker.lorem.words();
    $entity$.createdAt = faker.date.recent();
    $entity$.updatedAt = faker.date.recent();

    return $entity$;
  }

  static generateListed() {
    const $entity$ = this.generate();

    const listed$entity$: Listed$Entity$Dto = {
      id: $entity$.id,
      name: $entity$.name,
      createdAt: $entity$.createdAt.toISOString(),
      isActive: $entity$.isActive,
      notes: $entity$.notes,
    };

    return listed$entity$;
  }

  static generateManyListed(amount = faker.number.int(5)) {
    return Array.from({ length: amount }, () => this.generateListed());
  }
}
