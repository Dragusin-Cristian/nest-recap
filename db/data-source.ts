import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptionsP: Partial<DataSourceOptions> = {
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dataSourceOptionsP, {
      type: 'sqlite',
      database: 'db.sqlite',
      migrations: ['dist/db/migrations/*.js'],
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dataSourceOptionsP, {
      type: 'sqlite',
      database: 'test.sqlite',
      migrations: ['dist/db/migrations/*.js'],
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dataSourceOptionsP, {
      type: 'postgres',
      url: process.env.POSTGRESQL_INTERNAL_DB_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    throw new Error('unknown environment');
}

export const dataSourceOptions = dataSourceOptionsP;

const dataSource = new DataSource(dataSourceOptions as DataSourceOptions);
export default dataSource;
