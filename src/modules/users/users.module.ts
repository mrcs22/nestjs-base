import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AbstractUsersRepository } from './repositories/abstract.users.repository';
import { UsersTypeormRepository } from './repositories/typeorm/users.repository';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports:[RolesModule],
  controllers: [UsersController],
  exports: [
    UsersService,
    {
      provide: AbstractUsersRepository,
      useClass: UsersTypeormRepository,
    },
  ],
  providers: [
    UsersService,
    {
      provide: AbstractUsersRepository,
      useClass: UsersTypeormRepository,
    },
  ],
})
export class UserModule {}
