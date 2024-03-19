import { Module } from '@nestjs/common';
import { $Entities$Service } from './$entities$.service';
import { $Entities$Controller } from './$entities$.controller';
import { Abstract$Entities$Repository } from './repositories/abstract.$entities$.repository';
import { $Entities$TypeormRepository } from './repositories/typeorm/$entities$.repository';

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
