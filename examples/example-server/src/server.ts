import { createServer } from 'node:http';
import { createGraphst } from '../../../packages/graphst/src/index';
import { UserModule } from './user/user.module';

const graphst = createGraphst({ modules: [UserModule] });

const server = createServer(graphst);

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
