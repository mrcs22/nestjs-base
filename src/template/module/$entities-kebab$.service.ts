import { HttpStatus, Injectable } from '@nestjs/common';
import AppException from 'src/exception-filters/app-exception/app-exception';
import { Create$Entity$Dto } from './dto/create-$entity-kebab$.dto';
import { Update$Entity$Dto } from './dto/update-$entity-kebab$.dto';
import { Abstract$Entities$Repository } from './repositories/abstract.$entities-kebab$.repository';
import { $Entity$ } from './entities/$entity-kebab$.entity';
import { ListAll$Entities$Dto } from './dto/list-$entities-kebab$.dto';
import {
  FindServiceMode,
  FindServiceResult,
} from 'src/types/modules/find-service-mode';

@Injectable()
export class $Entities$Service {
  constructor(private $entity$Repository: Abstract$Entities$Repository) {}

  async create(create$Entity$Dto: Create$Entity$Dto) {
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

    if(!existing$Entity$?.isActive && mode === 'ensureActiveExistence') {
      throw new AppException(
        `O(a) $entity_pt$ não está ativo(a)`,
        HttpStatus.CONFLICT,
      );
    }

    return existing$Entity$ as FindServiceResult<$Entity$, Mode>;
  }
}
