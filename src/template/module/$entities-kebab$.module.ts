import { Module } from '@nestjs/common';
import { $Entities$Service } from './$entities-kebab$.service';
import { $Entities$Controller } from './$entities-kebab$.controller';
import { Abstract$Entities$Repository } from './repositories/abstract.$entities-kebab$.repository';
import { $Entities$TypeormRepository } from './repositories/typeorm/$entities-kebab$.repository';

@Module({
  controllers: [$Entities$Controller],
  exports: [
    $Entities$Service,
    {
      provide: Abstract$Entities$Repository,
      useClass: $Entities$TypeormRepository,
    },
  ],
  providers: [
    $Entities$Service,
    {
      provide: Abstract$Entities$Repository,
      useClass: $Entities$TypeormRepository,
    },
  ],
})
export class $Entities$Module {}
