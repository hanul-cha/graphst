import { GraphstServer } from 'graphst';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'test_db',
  username: 'root',
  password: 'root',
  synchronize: true,
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
  // providers: [
  //   {
  //     key: DataSource,
  //     instance: dataSource,
  //   },
  // ],
});

server.start(4000, () => {
  console.log('Server start 🕶️');
});
