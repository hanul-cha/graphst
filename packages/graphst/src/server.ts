import { MetadataStorage } from './metadata/MetadataStorage';
import { Module } from './module';

export interface GraphstOptions<TServerContext> {
  modules: Function[];
  context?: Promise<TServerContext>;
}

export class GraphstServer<TServerContext extends Record<string, any>> {
  constructor(options?: GraphstOptions<TServerContext>) {
    const modules = new Module(options?.modules);
  }
}

export function createGraphst<TServerContext extends Record<string, any>>(
  options?: GraphstOptions<TServerContext>
): GraphstServer<TServerContext> {
  const server = new GraphstServer(options);
  return server;

  // return adepter(server) TODO
}
