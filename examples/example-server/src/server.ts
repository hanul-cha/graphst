import { GraphstServer } from 'graphst/src';
import { DataSource } from 'typeorm';

const server = new GraphstServer({
  providers: [
    {
      provide: DataSource,
      valuable: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'test_db',
        username: 'root',
        password: 'root',
        synchronize: true,
      },
      callback: (instance: DataSource) => {
        instance
          .initialize()
          .then(() => {
            console.log('Data Source has been initialized!');
          })
          .catch((err) => {
            console.error('Error during Data Source initialization', err);
          });
      },
    },
  ],
});

server.start(4000, () => {
  console.log('Server start 🕶️');
});
