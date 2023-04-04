import { ModuleMetadataStorage } from './metadata/MetadataStorage';

export interface GraphstOptions<TServerContext> {
  modules: Function[];
  context?: Promise<TServerContext>;
}

export class GraphstServer<TServerContext extends Record<string, any>> {
  private _instances = {};

  constructor(options?: GraphstOptions<TServerContext>) {
    options?.modules.forEach((module) => {
      const storage = ModuleMetadataStorage.getStorage();
      const metadata = storage.modules.get(module);
      if (metadata) {
        [...(metadata.resolvers ?? []), ...(metadata.providers ?? [])].forEach(
          (resolve) => {
            const instance = new resolve();
            this._instances[resolve.name] = instance;
          }
        );
      }
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
