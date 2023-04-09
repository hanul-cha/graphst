import { createServer } from 'node:http';
import { createGraphst } from '../../../packages/graphst/src/index';
import { User } from './user/user.entity';

const graphst = createGraphst({ providers: [User] });

const server = createServer(graphst);

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
