import { environmentVariables } from '../../../config/environmentVariables';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const dbDataSourceOptions: DataSourceOptions = {
  type: environmentVariables.STORAGE_TYPE as MysqlConnectionOptions['type'],
  url: environmentVariables.DATABASE_URL,
  entities: [ './**/*.entity{ .ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'db_migrations_typeorm',
  synchronize: false,
  migrationsRun: false,
};

const dbDataSource = new DataSource(dbDataSourceOptions);

export default dbDataSource;
export { dbDataSourceOptions };
