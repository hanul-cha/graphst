import { Container } from './container';
import { createServer } from 'node:http';
import { graphql } from 'graphql';

export interface GraphstOptions<TServerContext> {
  providers?: Function[];
  context?: Promise<TServerContext>;
}

export class GraphstServer<TServerContext extends Record<string, any>> {
  private container: Container;

  constructor(options?: GraphstOptions<TServerContext>) {
    const container = new Container({
      providers: options?.providers ?? [],
    });
    container.boot();

    this.container = container;
  }

  start(port: number, callback?: () => void) {
    const graphqlSchema = this.container.graphqlSchema;

    if (!graphqlSchema) {
      throw new Error('GraphQL Schema is not generated');
    }

    const server = createServer((req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          const { query, variables } = JSON.parse(body);

          const result = await graphql(
            graphqlSchema,
            query,
            null,
            null,
            variables
          );

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        });
      } else {
        res.writeHead(400);
        res.end('Invalid request');
      }
    });

    server.listen(port, callback);
  }
}
