import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbDataSourceOptions } from './infra/database/typeorm/typeOrm.config';
import { RolesModule } from './modules/roles/roles.module';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './modules/auth/strategy/roles.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/strategy/jwtAuth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { AppExceptionFilter } from './exceptionFilters/AppException/AppExceptionFilter';
import { UserModule } from './modules/users/users.module';
 

@Module({
  imports: [
    TypeOrmModule.forRoot(dbDataSourceOptions),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    RolesModule,
    MailModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
