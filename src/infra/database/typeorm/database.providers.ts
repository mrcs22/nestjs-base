import dbDataSource from './typeOrm.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dbDataSource.initialize();
    },
  },
];
