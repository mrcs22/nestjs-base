import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { AbstractRolesRepository } from './repositories/abstract.roles.repository';
import { RolesTypeormRepository } from './repositories/typeorm/roles.repository';

@Module({
  controllers: [RolesController],
  exports: [
    RolesService,
    {
      provide: AbstractRolesRepository,
      useClass: RolesTypeormRepository,
    },
  ],
  providers: [
    RolesService,
    {
      provide: AbstractRolesRepository,
      useClass: RolesTypeormRepository,
    },
  ],
})
export class RolesModule {}
