import { GraphstServer } from 'graphst/src';

const server = new GraphstServer();

server.start(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
