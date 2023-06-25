import fs from 'fs';
import { Container } from './container';
import { createServer, Server } from 'node:http';
import { graphql, printSchema } from 'graphql';
import { GraphqlFactory } from './graphql/factory/graphqlFactory';
import { MiddlewareClass } from './middleware/middleware';
import { MetadataStorage } from './metadata/metadataStorage';
import { Provider } from './container/interfaces';
import { Type } from './interfaces/type';

export interface GraphstOptions {
  providers?: Provider[];
  resolvers?: Type[];
  autoSchemaFilePath?: string;
  middlewares?: MiddlewareClass[];
  corsOptions?: string | number | readonly string[];
}

export class GraphstServer {
  private storage = MetadataStorage.getStorage();
  private container: Container;
  private server: Server | null = null;
  private autoSchemaFilePath: string | null = null;
  private corsOptions: GraphstOptions['corsOptions'] | null = null;

  constructor(options?: GraphstOptions) {
    const container = new Container({
      providers: options?.providers ?? [],
      resolvers: options?.resolvers ?? [],
    });
    container.boot();

    this.container = container;
    this.storage.setGlobalMiddlewares(options?.middlewares ?? []);
    this.autoSchemaFilePath = options?.autoSchemaFilePath ?? null;
    this.corsOptions = options?.corsOptions ?? null;
  }

  start(port: number, callback?: () => void) {
    const graphqlFactory = this.container.getProvider(GraphqlFactory);
    if (!graphqlFactory) {
      throw new Error('GraphqlFactory is not provided');
    }

    const graphqlSchema = graphqlFactory.generate();

    const schema = graphqlFactory.getSchema();
    if (schema) {
      fs.writeFileSync(
        this.autoSchemaFilePath ?? 'schema.gql',
        printSchema(schema)
      );
    }

    this.server = createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', this.corsOptions ?? '*');

      const context = { req };

      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization'
        );

        res.writeHead(200);
        res.end();
      } else if (req.method === 'POST') {
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
