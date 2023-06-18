import fs from 'fs';
import { Container } from './container';
import { createServer, Server } from 'node:http';
import { graphql, printSchema } from 'graphql';
import { GraphstContextClass } from './context/GraphstContext';
import { GraphqlFactory } from './graphql/factory/graphqlFactory';
import { MiddlewareClass } from './middleware/middleware';
import { MetadataStorage } from './metadata/metadataStorage';
import { Provider } from './container/interfaces';
import { Type } from './interfaces/type';

export interface GraphstOptions<TServerContext> {
  providers?: Provider[];
  resolvers?: Type[];
  context?: TServerContext;
  autoSchemaFilePath?: string;
  middlewares?: MiddlewareClass[];
}

export type ContextCallback = new () => GraphstContextClass;

export class GraphstServer<
  T extends string,
  TServerContext extends {
    [key in T]: ContextCallback;
  }
> {
  private storage = MetadataStorage.getStorage();
  private container: Container;
  private server: Server | null = null;
  private context: TServerContext | null = null;
  private autoSchemaFilePath: string | null = null;

  constructor(options?: GraphstOptions<TServerContext>) {
    const container = new Container({
      providers: options?.providers ?? [],
      resolvers: options?.resolvers ?? [],
    });
    container.boot();

    this.context = options?.context ?? null;
    this.container = container;
    this.storage.setGlobalMiddlewares(options?.middlewares ?? []);
    this.autoSchemaFilePath = options?.autoSchemaFilePath ?? null;
  }

  start(port: number, callback?: () => void) {
    const graphqlFactory = this.container.getProvider(GraphqlFactory);
    const graphqlSchema = graphqlFactory.generate();

    if (!graphqlSchema) {
      throw new Error('GraphQL Schema is not generated');
    }

    const schema = graphqlFactory.getSchema();
    if (schema) {
      fs.writeFileSync(
        this.autoSchemaFilePath ?? 'schema.gql',
        printSchema(schema)
      );
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
