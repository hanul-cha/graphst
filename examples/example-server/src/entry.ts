import { GraphstServer } from 'graphst';
import { DataSource } from 'typeorm';
import { TestTableResolver } from './resolver/testResolver';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  entities: [__dirname + '/entity/*.js'],
});

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

const server = new GraphstServer({
  providers: [
    {
      key: DataSource,
      instance: dataSource,
    },
  ],
  resolvers: [TestTableResolver],
});

server.start(4001, () => {
  console.log('Server start 🕶️');
});
