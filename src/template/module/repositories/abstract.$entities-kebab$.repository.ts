import { RepositoryListingResult } from 'src/types/modules/repository-listing-mode';
import { $Entity$ } from '../entities/$entity-kebab$.entity';
import { ListAll$Entities$Dto } from '../dto/list-$entities-kebab$.dto';
import { Listed$Entity$Dto } from '../dto/listed-$entity-kebab$.dto';

export abstract class Abstract$Entities$Repository {
  abstract create(create$Entity$Dto: $Entity$): Promise<$Entity$>;
  abstract findById(id: string): Promise<$Entity$ | null>;
  abstract findByName(name: string): Promise<$Entity$ | null>;
  abstract update($entity$: $Entity$): Promise<$Entity$>;
  abstract remove(id: string): Promise<void>;
  abstract listAll<Simplified extends boolean>(
    ListAll$Entity$Dto: ListAll$Entities$Dto,
    simplified: Simplified,
  ): Promise<RepositoryListingResult<Listed$Entity$Dto, Simplified>>;
}
