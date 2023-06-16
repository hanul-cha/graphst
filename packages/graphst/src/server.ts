import { Container } from './container';
import { createServer, Server } from 'node:http';
import { graphql } from 'graphql';
import { GraphstContext } from './context/GraphstContext';
import { GraphqlFactory } from './graphql/factory/graphqlFactory';
import { MiddlewareClass } from './middleware/middleware';

export interface GraphstOptions<TServerContext> {
  providers?: Function[];
  context?: TServerContext;
  autoSchemaFilePath?: string;
  middlewares?: MiddlewareClass[];
}

export type ContextCallback = new () => GraphstContext;

export class GraphstServer<
  T extends string,
  TServerContext extends {
    [key in T]: ContextCallback;
  }
> {
  private container: Container;
  private server: Server | null = null;
  private context: TServerContext | null = null;

  constructor(options?: GraphstOptions<TServerContext>) {
    const container = new Container({
      providers: options?.providers ?? [],
    });
    container.boot();

    if (options?.context) {
      this.context = options.context;
    }
    this.container = container;
  }

  start(port: number, callback?: () => void) {
    const graphqlSchema = this.container.getProvider(GraphqlFactory).generate();

    if (!graphqlSchema) {
      throw new Error('GraphQL Schema is not generated');
    }

    this.server = createServer((req, res) => {
      const context = { req };

      if (this.context) {
        const entries = Object.entries(this.context) as [
          string,
          ContextCallback
        ][];

        for (const [key, fn] of entries) {
          context[key] = new fn().result(req);
        }
      }

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
            context,
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

    this.server.listen(port, callback);
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}
