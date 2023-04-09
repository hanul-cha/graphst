import { Container } from './container';

export interface GraphstOptions<TServerContext> {
  resolvers?: Function[];
  providers?: Function[];
  context?: Promise<TServerContext>;
}

export class GraphstServer<TServerContext extends Record<string, any>> {
  constructor(options?: GraphstOptions<TServerContext>) {
    const container = new Container({
      providers: options?.providers ?? [],
      resolvers: options?.resolvers ?? [],
    });
  }
}

export function createGraphst<TServerContext extends Record<string, any>>(
  options?: GraphstOptions<TServerContext>
): GraphstServer<TServerContext> {
  const server = new GraphstServer(options);
  return server;

  // return adepter(server) TODO
}
