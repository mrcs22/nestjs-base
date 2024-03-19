import { RepositoryListingResult } from 'src/types/modules/RepositoryListingMode';
import { ListAll$Entities$Dto } from '../dto/listAll$Entities$.dto';
import { Listed$Entity$Dto } from '../dto/listed$Entity$.dto';
import { $Entity$ } from '../entities/$entity$.entity';

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
