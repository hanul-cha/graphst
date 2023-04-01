export interface GraphstOptions<TServerContext> {
  modules: any[];
  context?: Promise<TServerContext>;
}

export class GraphstServer<TServerContext extends Record<string, any>> {
  constructor(options?: GraphstOptions<TServerContext>) {
    // this.options = options;
  }
}

export function createGraphst<TServerContext extends Record<string, any>>(
  options?: GraphstOptions<TServerContext>
): GraphstServer<TServerContext> {
  const server = new GraphstServer(options);
  return server;

  // return adepter(server) TODO
}
