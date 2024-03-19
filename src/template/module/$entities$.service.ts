import { HttpStatus, Injectable } from '@nestjs/common';
import AppException from 'src/exceptionFilters/AppException/AppException';
import { Create$Entity$Dto } from './dto/create$Entity$.dto';
import { Update$Entity$Dto } from './dto/update$Entity$.dto';
import { Abstract$Entities$Repository } from './repositories/abstract.$entities$.repository';
import { $Entity$ } from './entities/$entity$.entity';
import { ListAll$Entities$Dto } from './dto/listAll$Entities$.dto';
import {
  FindServiceMode,
  FindServiceResult,
} from 'src/types/modules/findServiceMode';

@Injectable()
export class $Entities$Service {
  constructor(private $entity$Repository: Abstract$Entities$Repository) {}

  async create(create$Entity$Dto: Create$Entity$Dto) {
    await this.findByName({
      name: create$Entity$Dto.name,
      mode: 'ensureNonExistence',
    });

    const $entity$ = new $Entity$();
    $entity$.fromDto(create$Entity$Dto);

    const created$Entity$ = await this.$entity$Repository.create($entity$);
    return created$Entity$;
  }

  listAll<Simplified extends boolean>(
    params: ListAll$Entities$Dto,
    simplified: Simplified,
  ) {
    return this.$entity$Repository.listAll(params, simplified);
  }

  async update(id: string, update$Entity$Dto: Update$Entity$Dto) {
    const $entity$ = await this.findById({ id, mode: 'ensureExistence' });

    const existing$Entity$WithName = await this.$entity$Repository.findByName(
      update$Entity$Dto.name,
    );

    if (existing$Entity$WithName && existing$Entity$WithName.id !== id) {
      throw new AppException(
        `Existe outro(a) $entity_pt$ come este nome`,
        HttpStatus.CONFLICT,
      );
    }

    $entity$.fromDto(update$Entity$Dto);
    return await this.$entity$Repository.update($entity$);
  }

  async remove(id: string) {
    await this.findById({
      id,
      mode: 'ensureExistence',
    });

    await this.$entity$Repository.remove(id);
  }

  async findByName<Mode extends FindServiceMode>(params: {
    name: string;
    mode?: Mode;
  }) {
    const { name, mode = 'default' } = params;
    const existing$Entity$ = await this.$entity$Repository.findByName(name);

    if (existing$Entity$ && mode === 'ensureNonExistence') {
      throw new AppException(
        `Existe outro(a) $entity_pt$ come este nome`,
        HttpStatus.CONFLICT,
      );
    }

    if (!existing$Entity$ && mode === 'ensureExistence') {
      throw new AppException(
        `Nenhum(a) $entity_pt$ com esse nome foi encontrado(a)`,
        HttpStatus.NOT_FOUND,
      );
    }

    return existing$Entity$ as FindServiceResult<$Entity$, Mode>;
  }

  async findById<Mode extends FindServiceMode>(params: {
    id: string;
    mode?: Mode;
  }) {
    const { id, mode = 'default' } = params;
    const existing$Entity$ = await this.$entity$Repository.findById(id);

    if (!existing$Entity$ && mode === 'ensureExistence') {
      throw new AppException(`$Entity_pt$ não encontrado(a)`, HttpStatus.NOT_FOUND);
    }

    if (existing$Entity$ && mode === 'ensureNonExistence') {
      throw new AppException(
        `Existe outro(a) $entity_pt$ com este id`,
        HttpStatus.CONFLICT,
      );
    }

    return existing$Entity$ as FindServiceResult<$Entity$, Mode>;
  }
}
